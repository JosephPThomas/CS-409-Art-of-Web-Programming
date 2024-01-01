const section_id = document.querySelectorAll("section[id]");


window.addEventListener("scroll", navPointer);

function navPointer() {
  const Y_differ = window.scrollY;

  section_id.forEach((section) => {
    const offset_height = section.offsetHeight;
    const offset_top = section.offsetTop - 300;
    const find_sectid = section.getAttribute("id");

    const mark_actv = document.querySelector(`.navigation a[href*=${find_sectid}]`);
    
    if (Y_differ > offset_top && Y_differ <= offset_top + offset_height) {
      mark_actv.classList.add("active");
    } else {
      mark_actv.classList.remove("active");
    }
  });
}

window.onscroll = function() {scrollFunction()};

function topNavScroll() {
  const active_navlink = document.querySelectorAll('nav li a');
  const Y_differ = window.scrollY;
  
  active_navlink.forEach((mark_actv) => {
    const top_padding = Y_differ > 80 ? '20px' : '34px';
    const bottom_padding = '16px';
    mark_actv.style.padding = top_padding + ' ' + bottom_padding;
  });
}

window.addEventListener('scroll', topNavScroll);


var modal = document.getElementById("myModal");
var modal1 = document.getElementById("myModal1");
var modal2 = document.getElementById("myModal2");


var btn = document.getElementById("myBtn");
var btn1 = document.getElementById("myBtn1");
var btn2 = document.getElementById("myBtn2");


var span = document.getElementById("close");
var span1 = document.getElementById("close1");
var span2 = document.getElementById("close2");


btn.onclick = function() {
  modal.style.display = "block";
}
btn1.onclick = function() {
  modal1.style.display = "block";
}
btn2.onclick = function() {
  modal2.style.display = "block";
}
span.onclick = function() {
  modal.style.display = "none";
}
span1.onclick = function() {
  modal1.style.display = "none";
}
span2.onclick = function() {
  modal2.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
window.onclick = function(event) {
  if (event.target == modal1) {
    modal1.style.display = "none";
  }
}
window.onclick = function(event) {
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
}

const carouselButtons = document.querySelectorAll("[data-carousel-button]")

carouselButtons.forEach(button => {
  button.addEventListener("click", () => {
    const buttonDirection = button.dataset.carouselButton === "next" ? 1 : -1;
    const carouselContainer = button.closest("[data-carousel]");
    const slides = carouselContainer.querySelector("[data-slides]");
    
    const activeSlide = slides.querySelector("[data-active]");
    let newIndex = [...slides.children].indexOf(activeSlide) + buttonDirection;
    
    if (newIndex < 0) newIndex = slides.children.length - 1;
    if (newIndex >= slides.children.length) newIndex = 0;
    
    slides.children[newIndex].dataset.active = true;
    delete activeSlide.dataset.active;
  });
});
