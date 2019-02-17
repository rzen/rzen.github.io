window.addEventListener('load', function () {
	var slideIndex = 1;
	showSlides(slideIndex);

	// Next/previous controls
	function plusSlides(n) {
	  showSlides(slideIndex += n);
	}

	// Thumbnail image controls
	function currentSlide(n) {
	  showSlides(slideIndex = n);
	}

	function showSlides(n) {
	  var i;
	  var slides = document.getElementsByClassName("slide");
	  var dots = document.getElementsByClassName("dot");
	  if (n > slides.length) {slideIndex = 1} 
	  if (n < 1) {slideIndex = slides.length}
	  for (i = 0; i < slides.length; i++) {
	      slides[i].style.display = "none"; 
	  }
	  // for (i = 0; i < dots.length; i++) {
	  //     dots[i].className = dots[i].className.replace(" active", "");
	  // }
	  slides[slideIndex-1].style.display = "block"; 
	  // dots[slideIndex-1].className += " active";
	}

	var slides = document.getElementsByClassName("slide");
	for (i = 0; i < slides.length; i++) {
		slides[i].style.cursor = 'pointer';
		slides[i].addEventListener('click', function (el) {
			plusSlides(1);
			console.log(el)
		}); 
	}




});