AFRAME.registerComponent("enemy-bullets", {
  init: function () {
    setInterval(this.shootEnemyBullet, 2000);
  },
  shootEnemyBullet: function () {
    var els = document.querySelectorAll(".enemy");
    console.log(els.length);

    for (var i = 0; i < els.length; i += 1) {
      var enemyBullet = document.createElement("a-entity");
      enemyBullet.setAttribute("geometry", {
        primitive: "sphere",
        radius: 0.2,
      });
      enemyBullet.setAttribute("material", "color", "black");

      // fix position
      var position = els[i].getAttribute("position");
      enemyBullet.setAttribute("position", {
        x: position.x + 0.5,
        y: position.y + 2.1,
        z: position.z,
      });

      var position1 = new THREE.Vector3();
      var position2 = new THREE.Vector3();

      var enemy = els[i].object3D;
      var player = document.querySelector("#weapon").object3D;

      enemy.getWorldDirection(position2);
      player.getWorldDirection(position1);

      var direction = new THREE.Vector3();
      direction.subVectors(position1, position2).normalize();

      enemyBullet.setAttribute("velocity", direction.multiplyScalar(-10));
      enemyBullet.setAttribute("dynamic-body", {
        shape: "sphere",
        mass: 0,
      });

      var scene = document.querySelector("#scene");
      scene.appendChild(enemyBullet);
    }

    var element = document.querySelector("#countLife");
    var playerLife = parseInt(element.getAttribute("text").value);

    enemyBullet.addEventListener("collide", function(e) {
      if (e.detail.body.el.id === "weapon") {
        console.log("collided")
        if (playerLife > 0) {
          playerLife -= 1;
          element.setAttribute("text", {
            value: playerLife,
          });
        }

        if (playerLife <= 0) {
          var text = document.querySelector("#over");
          text.setAttribute("visible", true);

          var tank = document.querySelectorAll(".enemy");
          for (var i = 0; i < tank.length; i += 1) {
            scene.removeChild(tank[i]);
          }
        }
      }
    });
  },
});
