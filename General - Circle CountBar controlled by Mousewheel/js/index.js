$(document).ready(function(){

  function animateElements() {
    $('.progressbar').each(function() {
      var elementPos = $(this).offset().top;
      var topOfWindow = $(window).scrollTop();
      var percent = $(this).find('.circle').attr('data-percent');
      var percentage = parseInt(percent, 10) / parseInt(100, 10);
      var animate = $(this).data('animate');
      if (elementPos < topOfWindow + $(window).height() - 30 && !animate) {
        $(this).data('animate', true);
        $(this).find('.circle').circleProgress({
          startAngle: -Math.PI / 2,
          value: percent / 100,
          thickness: 5,
          fill: {
            color: '#1B58B8'
          }
        }).on('circle-animation-progress', function(event, progress, stepValue) {
          $(this).find('div').text((stepValue * 100).toFixed(1) + "%");
        }).stop();
      }
    });
  }
  // Show animated elements
  animateElements();
  $(window).scroll(animateElements);


  // Check if cursor is inside circle
	var insideChart = 0;
	var chartSelector;

	$('.chart').hover(
    function (){
      $('body').css('overflow','hidden');
  		insideChart = 1;
  	}, 
    function (){
      $('body').css('overflow','auto');
  		insideChart = 0;
  	}
  )


  // Logic to handle scroll inside circle
  var charts = document.getElementsByClassName('chart');
  Array.from(charts).forEach((chart)=>
  {
  	chart.addEventListener('wheel', function(event)
    {
      //if(!insideChart) return
			let {newProgressValue, currentProgressValue} = calculateNewValues(chart,event);

       // Assign new values to chart
			chart.getElementsByClassName('chart-circle')[0].setAttribute('stroke-dasharray',newProgressValue);
			chart.getElementsByClassName('chart-percent')[0].innerHTML = currentProgressValue+"%";
  	}); 
  });

  function calculateNewValues(chart,event){
    // Get current values
    var progressValue = chart.getElementsByClassName('chart-circle')[0].getAttribute('stroke-dasharray');
    var currentProgressValue = progressValue.split(",")[0];
    var totalProgressValue = progressValue.split(",")[1]

    // Calculate new values
    if (event.deltaY < 0 && currentProgressValue < 100) // scrolling up
    {   
      currentProgressValue = parseInt(currentProgressValue) + 1;
    }
    else if (event.deltaY > 0 && currentProgressValue > 0) // scrolling down
    {
      currentProgressValue = parseInt(currentProgressValue) - 1;
    }

    return {
      newProgressValue: (currentProgressValue + ',' + totalProgressValue),
      currentProgressValue,
      totalProgressValue
    }
  }

})
