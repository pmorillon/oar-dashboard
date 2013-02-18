// application
//
OAR = Ember.Application.create({
  api_url: 'http://localhost:3000/oarapi',
  platform_name: 'IGRIDA OAR'
});

// Models
//
OAR.Job = Ember.Object.extend({
  id: null,
  owner: null,
  state: null,
  name: null,
  queue: null,
  wanted_resources: null,
  walltime: null,
  start_time: null,
  bar_style : null
});

// Views
//
OAR.CurrentJobsView = Ember.View.create({
  templateName: 'current-jobs'
});


// Controllers
//
OAR.JobsController = Ember.ArrayController.create({
  contend: [],
  loadJobs: function (state) {
    var array_controller = this;
    $.ajax({
      type: "GET",
      url: OAR.api_url + '/jobs/details.json',
      dataType: "json",
      data: { "state": state, "limit": 500, "offset": 0 },
      crossDomain: true,
      success: function(response) {
        array_controller.set('content', []);
        $(response.items).each(function (index, value) {
          var x = (((+new Date) - (value.start_time * 1000)) / (value.walltime * 1000)) * 100;
          var style = 'width:' + x + '%;height: 12px;';
          var job = OAR.Job.create({
            id: value.id,
            owner: value.owner,
            name: value.name,
            queue: value.queue,
            wanted_resources: value.wanted_resources,
            walltime: value.walltime,
            start_time: value.start_time,
            bar_style: style
          });
          array_controller.pushObject(job);
        });
      }
    });
  }
});

OAR.CurrentJobsView.appendTo('#current-jobs-section');
$('#platform_name')[0].innerHTML= OAR.platform_name;

OAR.JobsController.loadJobs('Running,Waiting,Finishing,Launching');

