// Applique le thème et la couleur d'accent avant le premier rendu (évite le flash clair/sombre).
try {
  var t = localStorage.getItem('searchit:theme');
  if (t === '"dark"' || t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) document.documentElement.classList.add('dark');
  var a = JSON.parse(localStorage.getItem('searchit:accent') || '"indigo"');
  if (/^[a-z]{3,10}$/.test(a)) document.documentElement.dataset.accent = a;
} catch (e) {}
