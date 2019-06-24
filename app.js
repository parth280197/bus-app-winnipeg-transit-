const apiKey = 'L9EimKN6WKikZPPs903';
const proxy = `https://cors-anywhere.herokuapp.com/`;
let schedulePromises = [];
fetch(`https://api.winnipegtransit.com/v3/streets.json?name=Henlow bay&api-key=${apiKey}`)
  .then((response) => {
    //requesting street key
    return response.json();
  })
  .then((data) => {
    const streetKey = data.streets[0].key;
    fetch(`https://api.winnipegtransit.com/v3/stops.json?street=${streetKey}&api-key=${apiKey}`)
      .then((response) => {
        //requesting stops of the streets
        return response.json();
      })
      .then((data) => {
        for (let busStop of data.stops) {
          let p = fetch(`https://api.winnipegtransit.com/v3/stops/${busStop.key}/schedule.json?api-key=${apiKey}&max-results-per-route=2`, {
              mode: 'cors'
            })
            .then((response) => {
              return response.json();
            });
          schedulePromises.push(p);
        }
        Promise.all(schedulePromises)
          .then((response) => {
            for (let res of response) {
              document.body.querySelector('ul').insertAdjacentHTML("beforeend",
                `
                </br>
                <li>STOP NAME:<b>${res['stop-schedule'].stop.name}</b></li>
                <li>CROSS STREET NAME:${res['stop-schedule'].stop['cross-street'].name}</li>
                <li>STOP DIRECTION:${res['stop-schedule'].stop.direction}</li>
                `
              );
              for (let route of res['stop-schedule']['route-schedules']) {
                document.body.querySelector('ul').insertAdjacentHTML("beforeend",
                  `<hr><li>ROUTE NAME:${route.route.name}</li>
                  <li>ROUTE NUMBER:${route.route.key}</li>
                  `
                );
                for (let bus of route['scheduled-stops']) {
                  document.body.querySelector('ul').insertAdjacentHTML("beforeend",
                    `<li>BUS SCHEDULED TIME: ${bus.times.arrival.scheduled}</li>`
                  );
                }
              }
            }
          })
      })
  })