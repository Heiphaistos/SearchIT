// Applique le thème avant le premier rendu (évite le flash clair/sombre).
try {
  var t = localStorage.getItem('searchit:theme');
  if (t === '"dark"' || t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) document.documentElement.classList.add('dark');
} catch (e) {}
