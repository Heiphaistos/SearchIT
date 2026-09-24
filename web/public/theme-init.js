// Applique le thème avant le premier rendu (évite le flash clair/sombre).
// Fichier externe plutôt que script inline : compatible avec la CSP « script-src 'self' ».
try {
  var t = localStorage.getItem('searchit:theme');
  if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) document.documentElement.classList.add('dark');
} catch (e) {
  // Stockage inaccessible (navigation privée stricte) : thème clair par défaut.
}
