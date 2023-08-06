    var vinyls;
    var vinylElements
    var coll = document.getElementsByClassName("collapsible");
    var colrecords = document.getElementsByClassName("colrecord");
    var collabels = document.getElementsByClassName("collabel");
    var expanders = document.getElementsByClassName("expander");
    var contents = document.getElementsByClassName("content");
    var records = document.getElementsByClassName("recordholder");
    var recordsvgs = document.getElementsByClassName("recordsvg");

    function setup (json) {
      vinyls = json;
      vinylElements = vinyls.map(generateVinylElements); 
      vinylElements.map((v) => {
      document.getElementById("colel").appendChild(v);
        });

      for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", makeExpandFunction(i));
      }

      //Make the DIV element draggable:
      for (record of document.getElementsByClassName("recordholder")) {
        dragElement(record);
      }
    }


    fetch('./src/vinyls.json')
      .then((response) => response.json())
      .then((json) => setup(json));


    
    function generateVinylElements (vinyl) {
      return elementFromHtml(
            `<div><button class="collapsible click">
<div class="colcontent click">
   <div class="backgroundcolcontent click" style="background-image: url(&quot;${vinyl.image}&quot;); background-position: ${vinyl.imageoffset ?? top}">
  </div>
  <div class="colrecord">

   <div id="${vinyl.name}" class="recordholder">
            <svg id="${vinyl.name}svg" class="recordsvg" width=${window.innerWidth*0.5} height=${window.innerWidth*0.5} viewbox="0 60 150 30">
     <g
     id="${vinyl.name}g1001"
     transform="translate(0,0)"> 
     <path
   id="${vinyl.name}path425"
            style="fill:${vinyl.color}"
       d="m 42.875,8.4726562 c -19.77898,1e-7 -35.8135,16.0315668 -35.8125,35.8105468 0,19.77898 16.03352,35.814453 35.8125,35.814453 19.77798,0 35.8125,-16.035473 35.8125,-35.814453 0,-19.77798 -16.03452,-35.8105468 -35.8125,-35.8105468 z M 42.873,41.857422 A 2.4260001,2.4260001 0 0 1 45.300734,44.283203 2.4260001,2.4260001 0 0 1 42.873,46.710938 2.4260001,2.4260001 0 0 1 40.447219,44.283203 2.4260001,2.4260001 0 0 1 42.873,41.857422 Z" />
     <path
       d="m 42.875,8.472 c 19.778,0 35.812,16.034 35.812,35.812 0,19.779 -16.034,35.813 -35.812,35.813 C 23.096,80.097 7.063,64.063 7.063,44.284 7.062,24.505 23.096,8.472 42.875,8.472 Z m 0,48.378 c 6.938,0 12.564,-5.627 12.564,-12.566 0,-6.939 -5.626,-12.565 -12.564,-12.565 -6.94,0 -12.565,5.625 -12.565,12.565 0,6.939 5.625,12.566 12.565,12.566 z"
   id="${vinyl.name}path144" />
   <text style="font: 3px sans-serif; "><textPath href="#${vinyl.name}path144" side="left" startOffset="80%">${vinyl.title}</textPath></text>
     </g>
        </svg>
      </div>
  </div>
  <div class="collabel click">
   ${vinyl.title}
  </div>
            <div class="expander click" style="background-image: url(&quot;${vinyl.image}&quot;);"></div>
</div>
      </button>
    <div class="content">
   </div>

            </div>`
            );
    }


window.addEventListener( "pageshow", function ( event ) {
  var historyTraversal = event.persisted || 
                         ( typeof window.performance != "undefined" && 
                              window.performance.navigation.type === 2 );
  if ( historyTraversal ) {
    // Handle page restore.
    window.location.reload();
  }
});

    function elementFromHtml(html) {
      const template = document.createElement("template");
      template.innerHTML = html.trim();
      return template.content.firstElementChild;
    }



    window.onresize = (event) => { 
          for (var i = 0; i < expanders.length; i++) {
            if (expanders[i].style.maxHeight) {
              expanders[i].style.maxHeight = expanders[i].offsetWidth - collabels[i].offsetHeight + "px";
              expanders[i].style.height = expanders[i].offsetWidth - collabels[i].offsetHeight + "px";
            }
          }
          for (recordsvg of recordsvgs) {
            recordsvg.style.width = window.innerWidth*0.5; 
            recordsvg.style.height = window.innerWidth*0.5
              }
        };


    function makeExpandFunction (i) {
      return function(e) {
         if (e.target.classList.contains("click")) {
        //coll[i].classList.toggle("active");
        records[i].classList.remove("record");
        records[i].style.top = null;
        records[i].style.left = null;

        records[i].classList.toggle("active");

        var content = expanders[i]
        var collabel = collabels[i]
        if (content.style.maxHeight){

          content.style.maxHeight = null;
          //colrecords[i].classList.toggle("hidden");
          colrecords[i].classList.toggle("shift");
        } else {
        /* setTimeout(() => {
               colrecords[i].classList.toggle("hidden");
             }, 200);
              */
        colrecords[i].classList.toggle("shift");
          content.style.maxHeight = content.offsetWidth - collabel.offsetHeight + "px";
          content.style.height = content.offsetWidth - collabel.offsetHeight + "px";
        } 
      }
      }
    }


    function dragElement(element) {
      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      element.onmousedown = dragMouseDown;

      function dragMouseDown(e) {
        element.classList.add("record");
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
      }

      function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;

        // if close enough to nub, snap to record player and play animation
        var actualsvg = document.getElementById(`${element.id}g1001`);
        var rect1 = actualsvg.getBoundingClientRect();
        var rect2 = document.getElementById("circle996").getBoundingClientRect();

        if (
          rect1.left < rect2.left &&
          rect1.left + rect1.width > rect2.left &&
          rect1.top < rect2.top &&
          rect1.top + rect1.height > rect2.top
            ) {
          element.classList.remove("record");
          element.classList.remove("recordholder");
          var recordplayersvg = document.getElementById(`recordplayersvg`);
          var hand = document.getElementById("hand");
          recordplayersvg.insertBefore(actualsvg, hand);
          actualsvg.setAttribute("transform", "translate(49.757308, 34.251618)")

          // animate record hand
          // recordplayersvg.appendChild(hand);
          hand.classList.add("hand-rotate");
          setTimeout(() => {
          actualsvg.classList.add("play-record");
                  }, 1000 )

          setTimeout(() => {
                window.location.href = `./pages/${element.id}.html`;
                  }, 5000 )
          /*
          for (const child of actualsvg.children) {
            child.classList.add("play-record");
          }
              */
        }
      }
    }

