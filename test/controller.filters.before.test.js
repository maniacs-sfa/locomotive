var Controller = require('../lib/locomotive/controller')
  , MockApplication = require('./mocks/application')
  , MockRequest = require('./mocks/request')
  , MockResponse = require('./mocks/response');



describe('Controller#before', function() {
  
  describe('filters declared above action', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.order = [];
    
    controller.before('index', function(next) {
      this.order.push('x');
      this.store = 'Amoeba Music';
      next();
    });
    controller.before('show', function(next) {
      this.order.push(1);
      this.band = 'Counting Crows';
      next();
    });
    controller.before('show', function(next) {
      this.order.push(2);
      this.album = 'August and Everything After';
      next();
    });
    controller.show = function() {
      this.order.push('a');
      this.song = 'Mr. Jones';
      this.render();
    }
    
    var req, res;
    
    before(function(done) {
      req = new MockRequest();
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('show');
    });
    
    it('should apply filters in correct order', function() {
      expect(controller.order).to.have.length(3);
      expect(controller.order[0]).to.equal(1);
      expect(controller.order[1]).to.equal(2);
      expect(controller.order[2]).to.equal('a');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/show.html.ejs');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(3);
      expect(res.locals.band).to.equal('Counting Crows');
      expect(res.locals.album).to.equal('August and Everything After');
      expect(res.locals.song).to.equal('Mr. Jones');
    });
  });
  
  describe('filters declared below action', function() {
    var app = new MockApplication();
    var controller = new Controller();
    controller.order = [];
    
    controller.show = function() {
      this.order.push('a');
      this.song = 'Mr. Jones';
      this.render();
    }
    controller.before('show', function(next) {
      this.order.push(1);
      this.band = 'Counting Crows';
      next();
    });
    controller.before('show', function(next) {
      this.order.push(2);
      this.album = 'August and Everything After';
      next();
    });
    controller.before('index', function(next) {
      this.order.push('x');
      this.store = 'Amoeba Music';
      next();
    });
    
    var req, res;
    
    before(function(done) {
      req = new MockRequest();
      res = new MockResponse(done);
      
      controller._init(app, 'test');
      controller._prepare(req, res, function(err) {
        if (err) { return done(err); }
        return done(new Error('should not call next'));
      });
      controller._invoke('show');
    });
    
    it('should apply filters in correct order', function() {
      expect(controller.order).to.have.length(3);
      expect(controller.order[0]).to.equal(1);
      expect(controller.order[1]).to.equal(2);
      expect(controller.order[2]).to.equal('a');
    });
    
    it('should render view without options', function() {
      expect(res._view).to.equal('test/show.html.ejs');
      expect(res._options).to.be.an('object');
      expect(Object.keys(res._options)).to.have.length(0);
    });
    
    it('should assign locals', function() {
      expect(res.locals).to.be.an('object');
      expect(Object.keys(res.locals)).to.have.length(3);
      expect(res.locals.band).to.equal('Counting Crows');
      expect(res.locals.album).to.equal('August and Everything After');
      expect(res.locals.song).to.equal('Mr. Jones');
    });
  });
  
  describe('filters for multiple actions declared above action', function() {
    var app = new MockApplication();
    var proto = new Controller();
    
    proto.before('index', function(next) {
      this.order.push('x');
      this.store = 'Amoeba Music';
      next();
    });
    proto.before(['theDoors', 'strangeDays'], function(next) {
      this.order.push(1);
      this.band = 'The Doors';
      next();
    });
    proto.theDoors = function() {
      this.order.push('a');
      this.song = 'Break On Through (To the Other Side)';
      this.render();
    }
    proto.strangeDays = function() {
      this.order.push('a');
      this.song = 'Love Me Two Times';
      this.render();
    }
    
    describe('invoking first action', function() {
      var controller = Object.create(proto);
      controller.order = [];
      var req, res;
    
      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);
      
        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('theDoors');
      });
    
      it('should apply filters in correct order', function() {
        expect(controller.order).to.have.length(2);
        expect(controller.order[0]).to.equal(1);
        expect(controller.order[1]).to.equal('a');
      });
    
      it('should render view without options', function() {
        expect(res._view).to.equal('test/the_doors.html.ejs');
        expect(res._options).to.be.an('object');
        expect(Object.keys(res._options)).to.have.length(0);
      });
    
      it('should assign locals', function() {
        expect(res.locals).to.be.an('object');
        expect(Object.keys(res.locals)).to.have.length(2);
        expect(res.locals.band).to.equal('The Doors');
        expect(res.locals.song).to.equal('Break On Through (To the Other Side)');
      });
    });
    
    describe('invoking second action', function() {
      var controller = Object.create(proto);
      controller.order = [];
      var req, res;
    
      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);
      
        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('strangeDays');
      });
    
      it('should apply filters in correct order', function() {
        expect(controller.order).to.have.length(2);
        expect(controller.order[0]).to.equal(1);
        expect(controller.order[1]).to.equal('a');
      });
    
      it('should render view without options', function() {
        expect(res._view).to.equal('test/strange_days.html.ejs');
        expect(res._options).to.be.an('object');
        expect(Object.keys(res._options)).to.have.length(0);
      });
    
      it('should assign locals', function() {
        expect(res.locals).to.be.an('object');
        expect(Object.keys(res.locals)).to.have.length(2);
        expect(res.locals.band).to.equal('The Doors');
        expect(res.locals.song).to.equal('Love Me Two Times');
      });
    });
  });
  
  describe('filters for multiple actions declared below action', function() {
    var app = new MockApplication();
    var proto = new Controller();
    
    proto.theDoors = function() {
      this.order.push('a');
      this.song = 'Break On Through (To the Other Side)';
      this.render();
    }
    proto.strangeDays = function() {
      this.order.push('a');
      this.song = 'Love Me Two Times';
      this.render();
    }
    proto.before(['theDoors', 'strangeDays'], function(next) {
      this.order.push(1);
      this.band = 'The Doors';
      next();
    });
    proto.before('index', function(next) {
      this.order.push('x');
      this.store = 'Amoeba Music';
      next();
    });
    
    describe('invoking first action', function() {
      var controller = Object.create(proto);
      controller.order = [];
      var req, res;
    
      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);
      
        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('theDoors');
      });
    
      it('should apply filters in correct order', function() {
        expect(controller.order).to.have.length(2);
        expect(controller.order[0]).to.equal(1);
        expect(controller.order[1]).to.equal('a');
      });
    
      it('should render view without options', function() {
        expect(res._view).to.equal('test/the_doors.html.ejs');
        expect(res._options).to.be.an('object');
        expect(Object.keys(res._options)).to.have.length(0);
      });
    
      it('should assign locals', function() {
        expect(res.locals).to.be.an('object');
        expect(Object.keys(res.locals)).to.have.length(2);
        expect(res.locals.band).to.equal('The Doors');
        expect(res.locals.song).to.equal('Break On Through (To the Other Side)');
      });
    });
    
    describe('invoking second action', function() {
      var controller = Object.create(proto);
      controller.order = [];
      var req, res;
    
      before(function(done) {
        req = new MockRequest();
        res = new MockResponse(done);
      
        controller._init(app, 'test');
        controller._prepare(req, res, function(err) {
          if (err) { return done(err); }
          return done(new Error('should not call next'));
        });
        controller._invoke('strangeDays');
      });
    
      it('should apply filters in correct order', function() {
        expect(controller.order).to.have.length(2);
        expect(controller.order[0]).to.equal(1);
        expect(controller.order[1]).to.equal('a');
      });
    
      it('should render view without options', function() {
        expect(res._view).to.equal('test/strange_days.html.ejs');
        expect(res._options).to.be.an('object');
        expect(Object.keys(res._options)).to.have.length(0);
      });
    
      it('should assign locals', function() {
        expect(res.locals).to.be.an('object');
        expect(Object.keys(res.locals)).to.have.length(2);
        expect(res.locals.band).to.equal('The Doors');
        expect(res.locals.song).to.equal('Love Me Two Times');
      });
    });
  });
  
});