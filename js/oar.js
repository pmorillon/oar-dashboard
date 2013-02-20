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
  progress : null
});

// Views
//
OAR.CurrentJobsView = Ember.View.create({
  templateName: 'current-jobs'
});

OAR.JobProgressBar = Ember.View.extend({
  classNames: ['progress'],
  classNameBindings: ['isRunning:progress', 'isLorF:progress-striped active'],
  attributeBindings: ['style'],
  style: "height: 12px; width: 80px; margin-bottom: 2px;margin-top: 2px;",
  template: Ember.Handlebars.compile('<div class="bar" {{bindAttr style="view.barStyle"}}></div>'),
  state: null,
  isRunning: Ember.computed(function() {
    return Ember.get(this, 'state') == 'Running' ? true : false;
  }),
  isLorF: Ember.computed(function() {
    return ((Ember.get(this, 'state') == 'Finishing') || (Ember.get(this, 'state') == 'Launching')) ? true : false;
  }),
  value: 0,
  barStyle: Ember.computed(function() {
    var value = Ember.get(this, 'value');
    return "width:" + value + "%;height: 12px;";
  }).property('value').cacheable()
})


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
          var job = OAR.Job.create({
            id: value.id,
            owner: value.owner,
            name: value.name,
            queue: value.queue,
            wanted_resources: value.wanted_resources,
            walltime: value.walltime,
            start_time: 0 ? "No prediction" : new Date(value.start_time * 1000),
            progress: (((+new Date) - (value.start_time * 1000)) / (value.walltime * 1000)) * 100
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

