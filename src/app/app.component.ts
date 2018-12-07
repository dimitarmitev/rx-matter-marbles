import { Component } from '@angular/core';
import { of, interval, timer } from 'rxjs';
import * as Matter from 'matter-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  Engine = Matter.Engine;
  Render = Matter.Render;
  Runner = Matter.Runner;
  Composites = Matter.Composites;
  MouseConstraint = Matter.MouseConstraint;
  Mouse = Matter.Mouse;
  World = Matter.World;
  Constraint = Matter.Constraint;
  Bodies = Matter.Bodies;

  engine: any;
  world: any;
  render: any;

  constructor() {
    // create engine
    this.engine = this.Engine.create();
    this.world = this.engine.world;

    // create renderer
    this.render = this.Render.create({
      element: document.body,
      engine: this.engine,
      options: {
        width: 800,
        height: 400,
        wireframes: false
      }
    });

    console.log(this.Bodies);
    this.Engine.run(this.engine);

    this.Render.run(this.render);

    this.World.add(this.world, [
      // walls
      this.Bodies.rectangle(400, 0, 810, 30, { isStatic: true }),
      this.Bodies.rectangle(400, 400, 810, 30, { isStatic: true }),
      this.Bodies.rectangle(800, 200, 30, 420, { isStatic: true }),
      this.Bodies.rectangle(0, 200, 30, 420, { isStatic: true })
    ]);
  }

  interval() {
    interval(1000).subscribe(i => {
      const bod = this.Bodies;
      const circle = bod.circle(550, 100, 20, {
        render: {
          fillStyle: 'orange',
          strokeStyle: 'black'
        }
      });
      this.World.add(this.world, [circle]);
    });
  }

  timer() {
    timer(1000, 500).subscribe(i => {
      const bod = this.Bodies;
      const circle = bod.circle(550, 100, 20, {
        render: {
          fillStyle: 'orange',
          strokeStyle: 'black'
        }
      });
      this.World.add(this.world, [circle]);
    });
  }
  buttonClick() {
    of(1, 2, 3, 4).subscribe(i => {
      const bod = this.Bodies;
      const circle = bod.circle(550, 100, 20, {
        render: {
          fillStyle: 'orange',
          strokeStyle: 'black'
        }
      });
      this.World.add(this.world, [circle]);
    });
  }
  defaultIfEmpty() {
    of().pipe(defaultIfEmpty('true'));
  }
}
