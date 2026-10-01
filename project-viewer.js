const viewer = document.querySelector('model-viewer');
const stage = document.querySelector('.model-stage');
const status = document.querySelector('.viewer-status');
const reset = document.querySelector('.viewer-reset');
const initialOrbit = viewer.getAttribute('camera-orbit');

function showError() {
  stage.setAttribute('aria-busy', 'false');
  status.textContent = 'The 3D preview could not load. Try refreshing or using a browser with 3D support.';
  status.hidden = false;
  reset.disabled = true;
}

viewer.addEventListener('load', () => {
  stage.setAttribute('aria-busy', 'false');
  status.hidden = true;
  reset.disabled = false;
});
viewer.addEventListener('error', showError);

reset.addEventListener('click', () => {
  viewer.cameraOrbit = initialOrbit;
  viewer.cameraTarget = 'auto auto auto';
  viewer.fieldOfView = 'auto';
  viewer.jumpCameraToGoal();
});

// Keep the viewer local and pinned. Each page's src can be replaced with its own GLB.
try {
  await import('./assets/vendor/model-viewer-4.3.1.min.js');
} catch {
  showError();
}
