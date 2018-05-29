---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
---

<canvas id="elk"></canvas>

<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.min.js" integrity="sha256-hYXbQJK4qdJiAeDVjjQ9G0D6A0xLnDQ4eJI9dkm7Fpk=" crossorigin="anonymous"></script>
<script>
  var canvas = document.getElementById("elk");
  var width = canvas.width = 450;
  var height = canvas.height = 450;
  var ctx = canvas.getContext("2d");
  var current = 0;
  var dataNum;
  var json;
  var ScreenPoint;
  var angle = 0;

  d3.json("assets/elk.json", function(elk) {
    dataNum = elk.length;
    json = elk;
    ScreenPoint = new vertex();
    var perv = 0 , m = 0;

    d3.timer(function(elapsed){
      m += (elapsed - perv);
      perv = elapsed;
      if(m < 30) return;
      m = 0;
      current = current + 1 != json.morphTargets.length ?  current : 0;
      ctx.setTransform(1,0,0,1,0,0);
      ctx.translate(width/2,height/2+50);
      ctx.clearRect(-width/2,-height/2-50,width,height);
      ctx.scale(1.5,-1.5);
      ctx.fillStyle = "rgba(22,22,22,0.8)";
      var vecs = json.morphTargets[current].vertices;
      var sin = Math.sin(angle);
      var cos = Math.cos(angle);
      for(var i=0;i<vecs.length;i+=3){
        var p = [vecs[i+0],vecs[i+1],vecs[i+2]];
        var po = [0,0,0];
        po[0] = cos * p[0]  - sin * p[2] ;
        po[1] = p[1] - 30;
        po[2] =  cos * p[2]  + sin * p[0];
        ScreenPoint.setVertex(po);
        var s = ScreenPoint.getScreenPoint();
        ctx.fillRect(s.x,s.y,1.5,1.5);
      }
      current++;
      angle += 0.01;
    });
  });

  function vertex(){
    this.x = 0;
      this.y = 0;
      this.z = 0;
      this.fl = 1000;
  }
  vertex.prototype.setVertex = function(p){
    this.x = p[0];
      this.y = p[1];
      this.z = p[2];
  }
  vertex.prototype.getScreenPoint = function(){
    var scale_z = this.fl + this.z;
      var scale = this.fl / scale_z;
      var x = this.x * scale;
      var y = this.y * scale;
      return {x:x , y:y , scale:scale};
  }
</script>

> Credit to [白露(hakuro)](https://codepen.io/hankuro)