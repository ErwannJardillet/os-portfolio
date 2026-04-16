---
status: fixing
trigger: "La musique de fond du site ne se lance pas toujours à la fin du faux écran de chargement (boot screen). Le problème est aléatoire."
created: 2026-04-16T00:00:00Z
updated: 2026-04-16T00:00:00Z
---

## Current Focus

hypothesis: audio.play() peut réussir (HTMLAudio autoplay plus permissif) mais l'AudioContext reste suspended → silence total. Le code actuel interprète play() réussi = succès, alors que ce peut être un succès silencieux.
test: Vérifier l'état de ctxRef.current après audio.play() — s'il est encore 'suspended', traiter comme un échec et laisser wantPlay=true pour retry au clic utilisateur.
expecting: Après le correctif, si AudioContext reste suspended post-play(), on setIsPlaying(false), wantPlay reste true, et unlock() réessaiera au premier clic.
next_action: DONE — correctif implémenté dans AudioContext.jsx

## Symptoms

expected: La musique de fond démarre automatiquement à la fin du fake loading screen, à 50% de volume.
actual: Parfois la musique ne démarre pas du tout après le chargement. C'est aléatoire — ça fonctionne parfois, pas d'autres fois.
errors: Aucun message d'erreur visible dans la console dans la plupart des cas. Parfois "Autoplay bloqué".
reproduction: Charger la page et attendre la fin du boot screen. Reproductible de manière aléatoire (environ 50% du temps).
started: Depuis le début. Le code a été réécrit récemment mais le bug persiste.

## Eliminated

- hypothesis: Race condition — play() appelé avant la fin du chargement audio
  evidence: wantPlay.current=true + retry depuis l'IIFE après chargement couvre ce cas
  timestamp: 2026-04-16T00:00:00Z

- hypothesis: Stale closure sur unlock/tryPlay
  evidence: tryPlay utilise des refs (audioRef, ctxRef, gainRef, wantPlay) qui sont mutables — la stale closure ne pose pas de problème fonctionnel
  timestamp: 2026-04-16T00:00:00Z

## Evidence

- timestamp: 2026-04-16T00:00:00Z
  checked: AudioContext.jsx tryPlay()
  found: Après audio.play() réussi, le code fait wantPlay.current=false et setIsPlaying(true) SANS vérifier ctxRef.current.state
  implication: Si AudioContext reste 'suspended' malgré resume(), le son est silencieux mais isPlaying=true — pas de retry

- timestamp: 2026-04-16T00:00:00Z
  checked: Web Audio API autoplay policy
  found: Chrome suspend l'AudioContext immédiatement à sa création s'il n'y a pas eu de gesture utilisateur. ctx.resume() dans ce contexte resolve la Promise sans changer l'état (reste 'suspended').
  implication: buildGraph() + resume() + audio.play() peut tous réussir sans erreur ET produire du silence

- timestamp: 2026-04-16T00:00:00Z
  checked: BootScreen.jsx
  found: onBootComplete() est appelé après BOOT_DURATION + 300ms fade-out. Aucune interaction utilisateur n'a eu lieu pendant ce délai (c'est automatique).
  implication: Quand play() est appelé, il n'y a JAMAIS eu de gesture utilisateur → autoplay policy s'applique systématiquement

## Resolution

root_cause: Dans tryPlay(), après audio.play() réussi, le code ne vérifie pas ctxRef.current.state. Si l'AudioContext est encore 'suspended' (ce qui arrive systématiquement sans gesture utilisateur), le son passe par un graph silencieux mais isPlaying est mis à true et wantPlay à false — empêchant tout retry.

fix: Après audio.play(), vérifier ctxRef.current.state. Si toujours 'suspended', annuler la lecture (audio.pause()), ne PAS mettre wantPlay=false, et retourner false pour que le handler unlock() réessaie au prochain clic/touche utilisateur.

verification: pending — attente confirmation utilisateur

files_changed:
  - src/contexts/AudioContext.jsx
