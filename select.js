document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("image1");
  const backgroundSelector = document.getElementById('backgroundSelector');
  const savedBackground = localStorage.getItem('selectedBackground');
  if (savedBackground) {
    document.body.classList.add(savedBackground);
    backgroundSelector.value = savedBackground; 
  }
  backgroundSelector.addEventListener('change', changeBackground);
  function changeBackground() {
    const selectedValue = backgroundSelector.value;
    document.body.classList.remove('gradient', 'image1', 'image2');
    document.body.classList.add(selectedValue);
    localStorage.setItem('selectedBackground', selectedValue);
  }
});
