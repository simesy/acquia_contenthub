"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('ch-ember-app/adapters/application', ['exports', 'ember-data', 'ember-http-hmac/mixins/hmac-adapter-mixin'], function (exports, _emberData, _emberHttpHmacMixinsHmacAdapterMixin) {
  exports['default'] = _emberData['default'].RESTAdapter.extend(_emberHttpHmacMixinsHmacAdapterMixin['default'], {
    // @Todo might me needed while writing tests.
    // host: Ember.computed('config.contentHubHost', function() {
    //   return config.contentHubHost;
    // }).volatile(),

    // headers: {
    //   'X-Acquia-Plexus-Client-Id': config.contentHubHeader,
    // },

  });
});
define('ch-ember-app/app', ['exports', 'ember', 'ch-ember-app/resolver', 'ember-load-initializers', 'ch-ember-app/config/environment'], function (exports, _ember, _chEmberAppResolver, _emberLoadInitializers, _chEmberAppConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _chEmberAppConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _chEmberAppConfigEnvironment['default'].podModulePrefix,
    Resolver: _chEmberAppResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _chEmberAppConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('ch-ember-app/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'ch-ember-app/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _chEmberAppConfigEnvironment) {

  var name = _chEmberAppConfigEnvironment['default'].APP.name;
  var version = _chEmberAppConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('ch-ember-app/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('ch-ember-app/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('ch-ember-app/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'ch-ember-app/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _chEmberAppConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_chEmberAppConfigEnvironment['default'].APP.name, _chEmberAppConfigEnvironment['default'].APP.version)
  };
});
define('ch-ember-app/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('ch-ember-app/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('ch-ember-app/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.ArrayController.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('ch-ember-app/initializers/export-application-global', ['exports', 'ember', 'ch-ember-app/config/environment'], function (exports, _ember, _chEmberAppConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_chEmberAppConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var value = _chEmberAppConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_chEmberAppConfigEnvironment['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('ch-ember-app/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('ch-ember-app/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('ch-ember-app/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define("ch-ember-app/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('ch-ember-app/instance-initializers/ember-http-hmac', ['exports', 'ch-ember-app/config/environment', 'ember-http-hmac/instance-initializers/setup-request-service'], function (exports, _chEmberAppConfigEnvironment, _emberHttpHmacInstanceInitializersSetupRequestService) {
  exports.initialize = initialize;

  function initialize(instance) {
    (0, _emberHttpHmacInstanceInitializersSetupRequestService['default'])(instance, _chEmberAppConfigEnvironment['default']);
  }

  exports['default'] = {
    name: 'ember-http-hmac',
    initialize: initialize
  };
});
define('ch-ember-app/mixins/hmac-adapter-mixin', ['exports', 'ember-http-hmac/mixins/hmac-adapter-mixin'], function (exports, _emberHttpHmacMixinsHmacAdapterMixin) {
  exports['default'] = _emberHttpHmacMixinsHmacAdapterMixin['default'];
});
define('ch-ember-app/models/entity', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    uuid: _emberData['default'].attr('string'),
    modified: _emberData['default'].attr('string'),
    title: _emberData['default'].attr('string'),
    body: _emberData['default'].attr('string'),
    isChecked: _emberData['default'].attr('boolean')
  });
});
define('ch-ember-app/models/list', ['exports', 'ember-data'], function (exports, _emberData) {

  var List = _emberData['default'].Model.extend({
    uuid: _emberData['default'].attr('string'),
    title: _emberData['default'].attr('string')
  });

  List.reopenClass({
    FIXTURES: [{
      "id": 1,
      "uuid": "179ed41a-a9ac-4ed6-8a25-eae1c544500e",
      "origin": "fa38e508-7b4e-49ad-605b-804b8845a051",
      "modified": "2016-04-15T03:03:52+00:00",
      "type": "node",
      "title": "article on lgexmqbxqs",
      "attributes": {
        "title": {
          "und": "article on lgexmqbxqs"
        },
        "body": {
          "und": "My article about lgexmqbxqs topics"
        }
      }
    }, {
      "id": 2,
      "uuid": "24acc5f3-cbba-4dec-8573-9582aff0ded8",
      "origin": "fa38e508-7b4e-49ad-605b-804b8845a051",
      "modified": "2016-04-15T02:58:58+00:00",
      "type": "node",
      "title": "CHMS-540 useudyovrq",
      "attributes": {
        "title": {
          "und": "CHMS-540 useudyovrq"
        },
        "body": {
          "und": "My article about lgexmqbxqs topics"
        }
      }
    }, {
      "id": 3,
      "uuid": "cc59f59b-b3a1-4c73-9b83-f4bdb121b9fb",
      "origin": "fa38e508-7b4e-49ad-605b-804b8845a051",
      "modified": "2016-04-15T02:42:23+00:00",
      "type": "node",
      "title": "imp article on fcvcgtimde",
      "attributes": {
        "title": {
          "und": "imp article on fcvcgtimde"
        },
        "body": {
          "und": "{\"summary\":\"\",\"value\":\"My article about lgexmqbxqs topics\",\"format\":\"filtered_html\"}"
        }
      }
    }]
  });

  exports['default'] = List;
});
define('ch-ember-app/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('ch-ember-app/router', ['exports', 'ember', 'ch-ember-app/config/environment'], function (exports, _ember, _chEmberAppConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _chEmberAppConfigEnvironment['default'].locationType
  });

  Router.map(function () {
    this.route('entity');
    this.route('data');
    this.route('list');
  });

  exports['default'] = Router;
});
define("ch-ember-app/routes/application", ["exports", "ember"], function (exports, _ember) {
    exports["default"] = _ember["default"].Route.extend({
        model: function model() {
            return data.data;
        }
    });

    var data = {
        "success": true,
        "total": 542,
        "data": [{
            "uuid": "179ed41a-a9ac-4ed6-8a25-eae1c544500e",
            "origin": "fa38e508-7b4e-49ad-605b-804b8845a051",
            "modified": "2016-04-15T03:03:52+00:00",
            "type": "node",
            "attributes": {
                "title": {
                    "und": "article on lgexmqbxqs"
                },
                "body": {
                    "und": "My article about lgexmqbxqs topics"
                }
            }
        }, {
            "uuid": "24acc5f3-cbba-4dec-8573-9582aff0ded8",
            "origin": "fa38e508-7b4e-49ad-605b-804b8845a051",
            "modified": "2016-04-15T02:58:58+00:00",
            "type": "node",
            "attributes": {
                "title": {
                    "und": "CHMS-540 useudyovrq"
                },
                "body": {
                    "und": "My article about lgexmqbxqs topics"
                }
            }
        }, {
            "uuid": "cc59f59b-b3a1-4c73-9b83-f4bdb121b9fb",
            "origin": "fa38e508-7b4e-49ad-605b-804b8845a051",
            "modified": "2016-04-15T02:42:23+00:00",
            "type": "node",
            "attributes": {
                "title": {
                    "und": "imp article on fcvcgtimde"
                },
                "body": {
                    "und": "{\"summary\":\"\",\"value\":\"My article about lgexmqbxqs topics\",\"format\":\"filtered_html\"}"
                }
            }
        }]
    };
});
define("ch-ember-app/routes/data", ["exports", "ember"], function (exports, _ember) {
    exports["default"] = _ember["default"].Route.extend({
        model: function model() {
            return data.data;
        }
    });

    var data = {
        "success": true,
        "total": 542,
        "data": [{
            "uuid": "179ed41a-a9ac-4ed6-8a25-eae1c544500e",
            "origin": "fa38e508-7b4e-49ad-605b-804b8845a051",
            "modified": "2016-04-15T03:03:52+00:00",
            "type": "node",
            "attributes": {
                "title": {
                    "und": "article on lgexmqbxqs"
                }
            }
        }, {
            "uuid": "24acc5f3-cbba-4dec-8573-9582aff0ded8",
            "origin": "fa38e508-7b4e-49ad-605b-804b8845a051",
            "modified": "2016-04-15T02:58:58+00:00",
            "type": "node",
            "attributes": {
                "title": {
                    "und": "CHMS-540 useudyovrq"
                }
            }
        }, {
            "uuid": "cc59f59b-b3a1-4c73-9b83-f4bdb121b9fb",
            "origin": "fa38e508-7b4e-49ad-605b-804b8845a051",
            "modified": "2016-04-15T02:42:23+00:00",
            "type": "node",
            "attributes": {
                "title": {
                    "und": "imp article on fcvcgtimde"
                }
            }
        }]
    };
});
define('ch-ember-app/routes/entity', ['exports', 'ember', 'ch-ember-app/config/environment'], function (exports, _ember, _chEmberAppConfigEnvironment) {
  exports['default'] = _ember['default'].Route.extend({
    requestSigner: _ember['default'].inject.service(),
    model: function model() {
      return this.store.query('entity', {
        type: 'node',
        fields: 'title,body'
      });
    },

    beforeModel: function beforeModel() {
      var _this = this,
          _arguments = arguments;

      return new _ember['default'].RSVP.Promise(function (resolve, reject) {
        var receiveMessage = function receiveMessage(event) {
          // For Chrome, the origin property is in the event.originalEvent object.
          // var origin = event.origin || event.originalEvent.origin;
          // @Todo Handle how to validate origin.
          // if (origin !== "")
          //   reject('Invalid origin');

          if (event.data.host !== undefined) {
            var headers = {
              'X-Acquia-Plexus-Client-Id': event.data.client,
              'X-Acquia-User-Agent': navigator.userAgent + ' ' + event.data.client_user_agent + ' AcquiaContentHubEmber/' + _chEmberAppConfigEnvironment['default'].applicationVersion
            };
            window.localStorage.setItem('source', event.data.source);
            _this._super.apply(_this, _arguments);
            var signer = _this.get('requestSigner');
            _this.store.adapterFor('application').set('host', event.data.host);
            _this.store.adapterFor('application').set('headers', headers);
            signer.set('realm', _chEmberAppConfigEnvironment['default'].contentHubRealm);
            signer.set('publicKey', event.data.public_key);
            signer.set('secretKey', event.data.secret_key);
            signer.set('signedHeader', ['X-Acquia-Plexus-Client-Id']);
            signer.set('signedHeader', ['X-Acquia-User-Agent']);
            signer.initializeSigner();
            resolve();
          }
        };
        window.addEventListener("message", receiveMessage, false);
      });
    },

    actions: {
      saveEntity: function saveEntity(data) {
        // Get the source platform to make a call to correct REST API.
        var source = window.localStorage.getItem('source');
        // Get the client url.
        var referrer = document.referrer.split('://')[1].split('/');
        var protocol = document.referrer.split('://')[0];
        var url = protocol + '://' + referrer[0];
        // Get the checked entity on discovery page.
        var checked = data.filterBy('isChecked', true);
        if (checked && source !== '') {
          if (source === 'wordpress') {
            _ember['default'].$.ajax({
              type: 'POST',
              crossOrigin: true,
              headers: {
                "Authorization": "Basic YWRtaW46YWRtaW4="
              },
              url: url + 'wp-json/wp/v2/posts/',
              data: {
                "title": {
                  "raw": checked[0].get('title')
                },
                "status": "publish"
              },
              dataType: 'json',
              cache: false,
              success: function success() {
                _ember['default'].$('.ch-success').show();
                _ember['default'].$('.ch-success').text('Successfully imported entity with title ' + checked[0].get('title'));
              },
              error: function error(request, textStatus, _error) {
                console.log(_error);
              }
            });
          } else if (source === 'drupal7') {
            _ember['default'].$.ajax({
              type: 'POST',
              crossOrigin: true,
              url: url + '/node.json',
              data: '{ "title": "' + checked[0].get('title') + '", "type": "article"}',
              contentType: 'application/json',
              dataType: 'json',
              cache: false,
              success: function success() {
                _ember['default'].$('.ch-success').show();
                _ember['default'].$('.ch-success').text('Successfully imported entity with title ' + checked[0].get('title'));
              },
              error: function error(request, textStatus, _error2) {
                console.log(_error2);
              }
            });
          } else {
            _ember['default'].$.ajax({
              type: 'POST',
              crossOrigin: true,
              url: url + '/content-hub/' + checked[0].get('uuid'),
              dataType: 'json',
              contentType: 'application/json',
              cache: false,
              success: function success() {
                _ember['default'].$('.ch-success').show();
                _ember['default'].$('.ch-success').text('Successfully imported entity with title ' + checked[0].get('title'));
              },
              error: function error(request, textStatus, _error3) {
                console.log(_error3);
              }
            });
          }
        }
      }
    }
  });
});
define('ch-ember-app/routes/list', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.store.findAll('list');
    }
  });
});
define('ch-ember-app/serializers/application', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].RESTSerializer.extend({
    primaryKey: 'uuid',

    modelNameFromPayloadKey: function modelNameFromPayloadKey(payloadKey) {
      if (payloadKey === 'data') {
        return this._super(payloadKey.replace('data', 'entities'));
      } else {
        return this._super(payloadKey);
      }
    },

    normalize: function normalize(model, hash, prop) {
      if (hash.attributes.title !== null) {
        hash.title = hash.attributes.title.und;
        delete hash.attributes.title.und;
      }

      if (hash.attributes.body !== null && hash.attributes.body.und && JSON.parse(hash.attributes.body.und) !== null) {
        hash.body = JSON.parse(hash.attributes.body.und).value;
        delete hash.attributes.body.und;
      }
      return this._super(model, hash, prop);
    }
  });
});
define('ch-ember-app/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('ch-ember-app/services/request-signer', ['exports', 'ember-http-hmac/services/request-signer'], function (exports, _emberHttpHmacServicesRequestSigner) {
  exports['default'] = _emberHttpHmacServicesRequestSigner['default'];
});
define('ch-ember-app/services/signed-ajax', ['exports', 'ember-http-hmac/services/signed-ajax'], function (exports, _emberHttpHmacServicesSignedAjax) {
  exports['default'] = _emberHttpHmacServicesSignedAjax['default'];
});
define("ch-ember-app/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 10
          }
        },
        "moduleName": "ch-ember-app/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["content", "outlet", ["loc", [null, [1, 0], [1, 10]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("ch-ember-app/templates/data", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": {
            "name": "missing-wrapper",
            "problems": ["wrong-type", "multiple-nodes"]
          },
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 4,
              "column": 0
            }
          },
          "moduleName": "ch-ember-app/templates/data.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("	");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n	");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("br");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          morphs[1] = dom.createMorphAt(fragment, 3, 3, contextualElement);
          return morphs;
        },
        statements: [["inline", "input", [], ["type", "checkbox", "id", ["subexpr", "@mut", [["get", "data.uuid", ["loc", [null, [2, 28], [2, 37]]]]], [], []]], ["loc", [null, [2, 1], [2, 39]]]], ["content", "data.attributes.title.und", ["loc", [null, [3, 1], [3, 30]]]]],
        locals: ["data"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 5,
            "column": 0
          }
        },
        "moduleName": "ch-ember-app/templates/data.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "each", [["get", "model", ["loc", [null, [1, 8], [1, 13]]]]], [], 0, null, ["loc", [null, [1, 0], [4, 9]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("ch-ember-app/templates/entity", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 7,
              "column": 0
            },
            "end": {
              "line": 15,
              "column": 0
            }
          },
          "moduleName": "ch-ember-app/templates/entity.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("	");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1, "class", "ch-row");
          var el2 = dom.createTextNode("\n		");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2, "class", "ch-id");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n		");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "ch-data");
          var el3 = dom.createTextNode("\n			");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n			");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("p");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n		");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n	");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [3]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
          morphs[1] = dom.createMorphAt(dom.childAt(element1, [1]), 0, 0);
          morphs[2] = dom.createMorphAt(dom.childAt(element1, [3]), 0, 0);
          return morphs;
        },
        statements: [["inline", "input", [], ["type", "checkbox", "id", ["subexpr", "@mut", [["get", "data.uuid", ["loc", [null, [9, 49], [9, 58]]]]], [], []], "checked", ["subexpr", "@mut", [["get", "data.isChecked", ["loc", [null, [9, 67], [9, 81]]]]], [], []]], ["loc", [null, [9, 22], [9, 83]]]], ["content", "data.title", ["loc", [null, [11, 6], [11, 20]]]], ["content", "data.body", ["loc", [null, [12, 6], [12, 19]]]]],
        locals: ["data"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 20,
            "column": 10
          }
        },
        "moduleName": "ch-ember-app/templates/entity.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "ch-discovery-page");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h2");
        var el3 = dom.createTextNode("Content Hub Discovery");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "ch-success");
        dom.setAttribute(el2, "style", "display:none;");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("form");
        dom.setAttribute(el2, "id", "ch-discovery-form");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3, "class", "ch-list");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3, "type", "submit");
        dom.setAttribute(el3, "class", "ch-btn");
        var el4 = dom.createTextNode("Import");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element2 = dom.childAt(fragment, [0, 5]);
        var morphs = new Array(3);
        morphs[0] = dom.createElementMorph(element2);
        morphs[1] = dom.createMorphAt(dom.childAt(element2, [1]), 1, 1);
        morphs[2] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["element", "action", ["saveEntity", ["get", "model", ["loc", [null, [5, 51], [5, 56]]]]], ["on", "submit"], ["loc", [null, [5, 29], [5, 70]]]], ["block", "each", [["get", "model", ["loc", [null, [7, 8], [7, 13]]]]], [], 0, null, ["loc", [null, [7, 0], [15, 9]]]], ["content", "outlet", ["loc", [null, [20, 0], [20, 10]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("ch-ember-app/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 0
            },
            "end": {
              "line": 11,
              "column": 0
            }
          },
          "moduleName": "ch-ember-app/templates/index.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("	");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1, "class", "ch-row");
          var el2 = dom.createTextNode("\n	");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n	");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("br");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n	");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("br");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n	");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(element0, 1, 1);
          morphs[1] = dom.createMorphAt(element0, 3, 3);
          morphs[2] = dom.createMorphAt(element0, 6, 6);
          return morphs;
        },
        statements: [["inline", "input", [], ["type", "checkbox", "id", ["subexpr", "@mut", [["get", "data.uuid", ["loc", [null, [7, 28], [7, 37]]]]], [], []]], ["loc", [null, [7, 1], [7, 39]]]], ["content", "data.attributes.title.und", ["loc", [null, [8, 1], [8, 30]]]], ["content", "data.attributes.body.und", ["loc", [null, [9, 1], [9, 29]]]]],
        locals: ["data"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "triple-curlies"
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 14,
            "column": 0
          }
        },
        "moduleName": "ch-ember-app/templates/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "ch-discovery-page");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h2");
        var el3 = dom.createTextNode("Content Hub Discovery");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        dom.setAttribute(el2, "class", "ch-list");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element1 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(element1, 3, 3);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [5]), 1, 1);
        return morphs;
      },
      statements: [["inline", "input", [], ["value", ["subexpr", "@mut", [["get", "search", ["loc", [null, [3, 14], [3, 20]]]]], [], []]], ["loc", [null, [3, 0], [3, 22]]]], ["block", "each", [["get", "model", ["loc", [null, [5, 8], [5, 13]]]]], [], 0, null, ["loc", [null, [5, 0], [11, 9]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("ch-ember-app/templates/list", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.5.1",
            "loc": {
              "source": null,
              "start": {
                "line": 8,
                "column": 1
              },
              "end": {
                "line": 10,
                "column": 1
              }
            },
            "moduleName": "ch-ember-app/templates/list.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("	");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("br");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["content", "data.title", ["loc", [null, [9, 1], [9, 15]]]]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 0
            },
            "end": {
              "line": 13,
              "column": 0
            }
          },
          "moduleName": "ch-ember-app/templates/list.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("	");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1, "class", "ch-row");
          var el2 = dom.createTextNode("\n	");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("	");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("br");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n	");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(element0, 1, 1);
          morphs[1] = dom.createMorphAt(element0, 3, 3);
          morphs[2] = dom.createMorphAt(element0, 5, 5);
          return morphs;
        },
        statements: [["inline", "input", [], ["type", "checkbox", "id", ["subexpr", "@mut", [["get", "data.uuid", ["loc", [null, [7, 28], [7, 37]]]]], [], []]], ["loc", [null, [7, 1], [7, 39]]]], ["block", "link-to", ["node"], [], 0, null, ["loc", [null, [8, 1], [10, 13]]]], ["content", "data.attributes.body.und", ["loc", [null, [11, 1], [11, 29]]]]],
        locals: ["data"],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "triple-curlies"
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 15,
            "column": 6
          }
        },
        "moduleName": "ch-ember-app/templates/list.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "ch-discovery-page");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h2");
        var el3 = dom.createTextNode("Content Hub Discovery");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        dom.setAttribute(el2, "class", "ch-list");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element1 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(element1, 3, 3);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [5]), 1, 1);
        return morphs;
      },
      statements: [["inline", "input", [], ["value", ["subexpr", "@mut", [["get", "search", ["loc", [null, [3, 14], [3, 20]]]]], [], []]], ["loc", [null, [3, 0], [3, 22]]]], ["block", "each", [["get", "model", ["loc", [null, [5, 8], [5, 13]]]]], [], 0, null, ["loc", [null, [5, 0], [13, 9]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('ch-ember-app/config/environment', ['ember'], function(Ember) {
  var prefix = 'ch-ember-app';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("ch-ember-app/app")["default"].create({"name":"ch-ember-app","version":"0.0.0+5fed4849"});
}

/* jshint ignore:end */
//# sourceMappingURL=ch-ember-app.map