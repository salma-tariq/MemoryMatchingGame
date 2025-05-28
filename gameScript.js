var em = ["💐","🌹","🌻","🏵️","🌺","🌴","🌈","🍓","🍒","🍎","🍉","🍊","🥭","🍍","🍋","🍏","🍐","🥝","🍇","🥥","🍅","🌶️","🍄","🧅","🥦","🥑","🍔","🍕","🧁","🎂","🍬","🍩","🍫","🎈"];
// Shuffling the emoji array above
var tmp, c, p = em.length;
if(p) while(--p) {
   c = Math.floor(Math.random() * (p + 1));
   tmp = em[c];
   em[c] = em[p];
   em[p] = tmp;
}

// Defining the variables
var pre="", pID, ppID=0, turn=0, t="transform", flip="rotateY(180deg)", flipBack="rotateY(0deg)", time, mode;

// Resizing the screen
window.onresize = init;
function init() {
   W = innerWidth;
   H = innerHeight;
   $('body').height(H+"px");
   $('#ol').height(H+"px");
}

// When the window onloads, the player is shown the instructions
window.onload = function() {
    $("#ol").html(`<center><div id="inst"><h3>Welcome To My Final Year Project!</h3>Instructions To Play The Memory Matching Game<br/><br/><li>Flip two cards to make similar pairs.</li><li>Simply click on the card to flip it.</li><li>If the two cards you flipped don't match, they will be flipped back.</li><p style="font-size:23px;">Click one of the following levels to start the game.</p></div><button onclick="start(3, 4)">3 x 4</button> <button onclick="start(4, 4)" style="w">4 x 4</button><button onclick="start(4, 5)">4 x 5</button><button onclick="start(5, 6)">5 x 6</button><button onclick="start(6, 6)">6 x 6</button></center>`);
}

// This function starts the game when the player clicks on one of the levels
function start(r,l) {
    // Performance tracking - moves and timer 
    min=0, sec=0, moves=0, score=0;
    $("#time").html("Time: 00:00");
    $("#moves").html("Moves: 0");
	$("#score").html("Score: 0");
    time = setInterval(function() {
      sec++;
      if(sec==60) {
          min++; sec=0;
      }
      if(sec<10) 
          $("#time").html("Time: 0"+min+":0"+sec);
      else 
        $("#time").html("Time: 0"+min+":"+sec);
    }, 1000);
    rem=r*l/2, noItems=rem;
    mode = r+"x"+l;
    // Generating the cards and shuffling it
    var items = [];
    for (var i=0;i<noItems;i++)
        items.push(em[i]);
    for (var i=0;i<noItems;i++)
        items.push(em[i]);
    var tmp, c, p = items.length;
    if(p) while(--p) {
        c = Math.floor(Math.random() * (p + 1));
        tmp = items[c];
        items[c] = items[p];
        items[p] = tmp;
    }
    
    // Creating the grid for the cards
    $("table").html("");
    var n=1;
    for (var i = 1;i<=r;i++) {
        $("table").append("<tr>");
        for (var j = 1;j<=l;j++) {
           $("table").append(`<td id='${n}' onclick="change(${n})"><div class='inner'><div class='front'></div><div class='back'><p>${items[n-1]}</p></div></div></td>`);
           n++;
         }
         $("table").append("</tr>");
    }
    
    // Fading out the instructions once the game begins
    $("#ol").fadeOut(500);
}

// This function is for flipping the cards
function change(x) {
  //Variables
  let i = "#"+x+" .inner";
  let f = "#"+x+" .inner .front";
  let b = "#"+x+" .inner .back";
  
  //Don't flip for these conditions
  if (turn==2 || $(i).attr("flip")=="block" || ppID==x) {}
  
  //Flip
  else {
    $(i).css(t, flip);
    if (turn==1) {
      //This value will prevent spam clicking
      turn=2;
      
      //If both flipped cards don't match
      if (pre!=$(b).text()) {
         setTimeout(function() {
            $(pID).css(t, flipBack);
            $(i).css(t, flipBack);
            //score performance tracking element
			score=score-3;
			$("#score").html("Score: "+score);
			ppID=0;
			
         },1000);
      }
      
      //If the cards flipped match
      else {
          rem--;
          $(i).attr("flip", "block");
          $(pID).attr("flip", "block");
		  //score performance tracking element
		  score=score+10;
		  $("#score").html("Score: "+score);
      }
      
      setTimeout(function() {
         turn=0;
         // Moves are incremented
         moves++;
         $("#moves").html("Moves: "+moves);
      },1150);
      
    }
    else {
      pre = $(b).text();
      ppID = x;
      pID = "#"+x+" .inner";
      turn=1;
    }
    
    //If all pairs are matched
    if (rem==0) {
          clearInterval(time);
          if (min==0) {
              time = `${sec} seconds`;
          }
          else {
              time = `${min} minute(s) and ${sec} second(s)`;
          }
          setTimeout(function() {
              $("#ol").html(`<center><div id="iol"><h1>Congratulations!</h1><p style="font-size:28px;padding:10px;">You completed the ${mode} level in ${moves} moves. Your score was ${score}! It took you ${time}.</p><p style="font-size:22px">Would you like to play again?</p><button onclick="start(3, 4)">3 x 4</button> <button onclick="start(4, 4)" style="w">4 x 4</button><button onclick="start(4, 5)">4 x 5</button><button onclick="start(5, 6)">5 x 6</button><button onclick="start(6, 6)">6 x 6</button></div></center>`);
              $("#ol").fadeIn(750);
          }, 1500);
    }
  }
}