import { Component } from '@angular/core';
import { of, interval, timer, Subscription, merge, fromEvent, from } from 'rxjs';
import { map, mapTo, takeUntil, reduce, flatMap, find, filter, delay, mergeMap, zip, defaultIfEmpty } from 'rxjs/operators';
import * as Matter from 'matter-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  acc = 0;

  subscriptions: Subscription[] = [];

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
        width: 1200,
        height: 700,
        wireframes: false
      }
    });

    console.log(this.Bodies);
    this.Engine.run(this.engine);

    this.Render.run(this.render);

    this.World.add(this.world, [
      // walls
      // this.Bodies.rectangle(700, 0, 810, 30, { isStatic: true }),
      // this.Bodies.rectangle(700, 700, 810, 30, { isStatic: true }),
      // this.Bodies.rectangle(1200, 200, 30, 720, { isStatic: true }),
      // this.Bodies.rectangle(0, 200, 30, 720, { isStatic: true })
    ]);
  }

  interval() {
    this.subscriptions.push(
      interval(1000).subscribe(i => {
        const bod = this.Bodies;
        const circle = bod.circle(550, 100, 20, {
          render: {
            fillStyle: 'orange',
            strokeStyle: 'black'
          }
        });
        this.World.add(this.world, [circle]);
      })
    );
  }

  merge() {
    this.subscriptions.push(
      merge(
      interval(500).pipe(map(x => {
        const bod = this.Bodies;
        const circle = bod.circle(100, 100, 20, {
          render: {
            fillStyle: 'green',
            strokeStyle: 'black'
          }
        });
        this.World.add(this.world, [circle]);
        return 'green';
      }
      )),
      interval(800).pipe(map( y => {
        const bod = this.Bodies;
        const circle = bod.circle(400, 100, 20, {
          render: {
            fillStyle: 'red',
            strokeStyle: 'black'
          }
        });
        this.World.add(this.world, [circle]);
        return 'red';
      }))).subscribe(
        i => {
          const bod = this.Bodies;
          const circle = bod.circle(600, 100, 20, {
            render: {
              fillStyle: i,
              strokeStyle: 'black'
            }
          });
          this.World.add(this.world, [circle]);
        }
      )
    );
  }


  flatMap() {
    // timer(100).pipe(flatMap( x => x));
//    flatMap(timer(1000));
    // timer(1000).pipe(map(
    //   i => <any>i
    //     )
    //   ).flatMap(x => of([]));
  }

  reduce() {
      const clicksInFiveSeconds = fromEvent(document, 'click').pipe(map(x => {
        const bod = this.Bodies;
        const circle = bod.circle(550, 100, 10, {
          render: {
            fillStyle: 'orange',
            strokeStyle: 'black'
          }
        });
        this.World.add(this.world, [circle]);
        return x;
      }))
      .pipe(
        takeUntil(interval(5000))
      )
      ;
      const ones = clicksInFiveSeconds.pipe(mapTo(1));
      const seed = 0;
      const count = ones.pipe(reduce((acc, one) => { this.acc = acc; return acc + one; }, seed));
      count.subscribe(x => {
          const bod = this.Bodies;
          const circle = bod.circle(550, 100, 10 * x, {
            render: {
              fillStyle: 'orange',
              strokeStyle: 'black'
            }
          });
          this.World.add(this.world, [circle]);
        }
      );
  }

  timer() {
    this.subscriptions.push(
      timer(1000, 500).subscribe(i => {
        const bod = this.Bodies;
        const circle = bod.circle(550, 100, 20, {
          render: {
            fillStyle: 'orange',
            strokeStyle: 'black'
          }
        });
        this.World.add(this.world, [circle]);
      })
    );
  }

  find() {
    of(3, 2, 7, 6, 3, 8, 2, 9).pipe(map(x => {
      const bod = this.Bodies;
      const circle = bod.circle(100, 100, 10 * x, {
        render: {
          fillStyle: 'orange',
          strokeStyle: 'black'
        }
      });
      this.World.add(this.world, [circle]);
      return x; })).pipe(find(x => x > 5)).subscribe(
      x => {
        const bod = this.Bodies;
        const circle = bod.circle(500, 100, 10 * x, {
          render: {
            fillStyle: 'red',
            strokeStyle: 'black'
          }
        });
        this.World.add(this.world, [circle]);
      }
    );
  }

  // filter() {
  //   of(3, 2, 7, 6, 3, 8, 2, 9).pipe(mergeMap(x => {
  //     const bod = this.Bodies;
  //     const circle = bod.circle(100, 100, 10 * x, {
  //       render: {
  //         fillStyle: 'orange',
  //         strokeStyle: 'black'
  //       }
  //     });
  //     this.World.add(this.world, [circle]);
  //     return of(x).pipe(delay(1000)); }))
  //     .pipe(filter(x => x > 5)).subscribe(
  //     x => {
  //       const bod = this.Bodies;
  //       const circle = bod.circle(500, 100, 10 * x, {
  //         render: {
  //           fillStyle: 'red',
  //           strokeStyle: 'black'
  //         }
  //       });
  //       this.World.add(this.world, [circle]);
  //     }
  //   );
  // }

  filter() {
    of(3, 2, 7, 6, 3, 8, 2, 9).pipe(zip( timer(0, 500), (x, y) => {
      console.log(y);
      const bod = this.Bodies;
      const circle = bod.circle(100, 100, 10 * x, {
        render: {
          fillStyle: 'orange',
          strokeStyle: 'black'
        }
      });
      this.World.add(this.world, [circle]);
      return x; }))
      .pipe(filter(x => x > 5)).subscribe(
      x => {
        const bod = this.Bodies;
        const circle = bod.circle(500, 100, 10 * x, {
          render: {
            fillStyle: 'red',
            strokeStyle: 'black'
          }
        });
        this.World.add(this.world, [circle]);
      }
    );
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
    from([]).pipe(map(color => {
      const bod = this.Bodies;
      const circle = bod.circle(150, 100, 20, {
        render: {
          fillStyle: color,
          strokeStyle: 'black'
        }
      });
      this.World.add(this.world, [circle]);
      return color;
    })).pipe(defaultIfEmpty('red')).subscribe(i => {
      const bod = this.Bodies;
      const circle = bod.circle(550, 100, 20, {
        render: {
          fillStyle: i,
          strokeStyle: 'black'
        }
      });
      this.World.add(this.world, [circle]);
    });
    from(['yellow']).pipe(map(color => {
      const bod = this.Bodies;
      const circle = bod.circle(150, 100, 20, {
        render: {
          fillStyle: color,
          strokeStyle: 'black'
        }
      });
      this.World.add(this.world, [circle]);
      return color;
    })).pipe(defaultIfEmpty('red')).subscribe(i => {
      const bod = this.Bodies;
      const circle = bod.circle(550, 100, 20, {
        render: {
          fillStyle: i,
          strokeStyle: 'black'
        }
      });
      this.World.add(this.world, [circle]);
    });

    // from([1, 2, 3, 4, 5, 6, 7]).subscribe(i => {
    //   const bod = this.Bodies;
    //   const circle = bod.circle(550, 100, 20, {
    //     render: {
    //       fillStyle: 'orange',
    //       strokeStyle: 'black'
    //     }
    //   });
    //   this.World.add(this.world, [circle]);
    // });
    // of().pipe(defaultIfEmpty('true'));
  }
  stop() {
    this.subscriptions.forEach(
      subscription => {
        if (subscription) {
          subscription.unsubscribe();
        }
      }
    );
  }
}





