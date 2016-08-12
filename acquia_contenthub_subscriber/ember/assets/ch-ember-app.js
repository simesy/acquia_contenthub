"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('ch-ember-app/adapters/application', ['exports', 'ember', 'ember-data', 'ember-http-hmac/mixins/hmac-adapter-mixin'], function (exports, _ember, _emberData, _emberHttpHmacMixinsHmacAdapterMixin) {
  exports['default'] = _emberData['default'].RESTAdapter.extend(_emberHttpHmacMixinsHmacAdapterMixin['default'], {
    pathForType: function pathForType(modelName) {
      // Mapping models to plexus endpoints
      // REFER: http://api.content-hub.acquia.com/
      if (modelName === 'client') {
        return 'settings';
      } else {
        return _ember['default'].String.pluralize(modelName);
      }
    }
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
define('ch-ember-app/components/basic-dropdown', ['exports', 'ember-basic-dropdown/components/basic-dropdown'], function (exports, _emberBasicDropdownComponentsBasicDropdown) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBasicDropdownComponentsBasicDropdown['default'];
    }
  });
});
define('ch-ember-app/components/basic-dropdown/content', ['exports', 'ember-basic-dropdown/components/basic-dropdown/content'], function (exports, _emberBasicDropdownComponentsBasicDropdownContent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBasicDropdownComponentsBasicDropdownContent['default'];
    }
  });
});
define('ch-ember-app/components/basic-dropdown/trigger', ['exports', 'ember-basic-dropdown/components/basic-dropdown/trigger'], function (exports, _emberBasicDropdownComponentsBasicDropdownTrigger) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBasicDropdownComponentsBasicDropdownTrigger['default'];
    }
  });
});
define('ch-ember-app/components/basic-dropdown/wormhole', ['exports', 'ember-basic-dropdown/components/basic-dropdown/wormhole'], function (exports, _emberBasicDropdownComponentsBasicDropdownWormhole) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBasicDropdownComponentsBasicDropdownWormhole['default'];
    }
  });
});
define('ch-ember-app/components/discovery-page', ['exports', 'ember', 'ch-ember-app/config/environment', 'moment'], function (exports, _ember, _chEmberAppConfigEnvironment, _moment) {
  exports['default'] = _ember['default'].Component.extend({
    // Inject the signed ajax service, in which http-hmac headers can be included.
    // REFER: https://github.com/acquia/ember-http-hmac/blob/master/README.md
    requestSigner: _ember['default'].inject.service(),
    signedAjax: _ember['default'].inject.service(),

    init: function init() {
      this._super.apply(this, arguments);
      var signer = this.get('requestSigner');
      signer.set('realm', _chEmberAppConfigEnvironment['default'].contentHubRealm);
      signer.set('publicKey', _chEmberAppConfigEnvironment['default'].contentHubAPIKey);
      signer.set('secretKey', _chEmberAppConfigEnvironment['default'].contentHubSecretKey);
      signer.set('signedHeader', ['X-Acquia-Plexus-Client-Id']);
      signer.initializeSigner();

      this.searchKeyword = "";
      this.searchResults = [];

      // Fetch search results when the app initially loads
      this.searchContentHub();
    },

    searchContentHub: function searchContentHub() {
      var self = this;
      // Start building the elastic search query request.
      var queryRequestBody = {
        "query": {
          "filtered": {
            "query": {
              "bool": {}
            },
            "filter": {
              "term": {
                "data.type": "node"
              }
            }
          }
        },
        "size": 25,
        "from": 0,
        "highlight": {
          "fields": {
            "*": {}
          }
        }
      };
      queryRequestBody.query.filtered.query.bool.must = [];

      // Build keyword part of the elastic search query
      if (_ember['default'].isPresent(this.get("searchKeyword"))) {
        queryRequestBody.query.filtered.query.bool.must.push({
          "match": {
            "_all": "*" + this.get('searchKeyword') + "*"
          }
        });
      }

      // Build tag part of the elastic search query
      if (_ember['default'].isPresent(this.get("selectedTag"))) {
        this.get("selectedTag").forEach(function (item) {
          queryRequestBody.query.filtered.query.bool.must.push({
            "multi_match": {
              "query": item.get('uuid'),
              "fields": ["data.attributes.field_tags.value.*"]
            }
          });
        });
      }

      // Build source/origin part of the elastic search query
      if (_ember['default'].isPresent(this.get("selectedSource"))) {
        queryRequestBody.query.filtered.query.bool.must.push({
          "match": {
            "data.origin": this.get("selectedSource").map(function (a) {
              return a.get('uuid');
            }).join(",") }
        });
      }

      // Build date filtering part of the elastic search query
      if (_ember['default'].isPresent(this.get("filterFromDate")) || _ember['default'].isPresent(this.get("filterToDate"))) {
        // NOTE In all our Content Hub search requests, even D7 discovery page,
        // we currently hardcode the timezone to +1:00. Perhaps we will make this
        // dynamic in future.
        // REFER: TODO
        queryRequestBody.filter = {
          "range": {
            "data.modified": {
              "time_zone": "+1:00"
            }
          }
        };
        if (_ember['default'].isPresent(this.get("filterFromDate"))) {
          queryRequestBody.filter.range['data.modified'].gte = (0, _moment['default'])(this.get("filterFromDate")).format('YYYY-MM-DD');
        }
        if (_ember['default'].isPresent(this.get("filterToDate"))) {
          queryRequestBody.filter.range['data.modified'].lte = (0, _moment['default'])(this.get("filterToDate")).format('YYYY-MM-DD');
        }
      }

      // Hit plexus search endpoint with the queryRequest
      this.get('signedAjax').request(_chEmberAppConfigEnvironment['default'].contentHubHost + '/_search', {
        type: 'POST',
        headers: {
          'X-Acquia-Plexus-Client-Id': _chEmberAppConfigEnvironment['default'].hostClientId
        },
        crossOrigin: true,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(queryRequestBody)
      }).then(function (response) {
        // empty search results
        self.get('searchResults').clear();
        // populate search results with search response
        response.hits.hits.forEach(function (item) {
          var titleValue = null;
          var bodyValue = null;
          // NOTE: Team has decided to support only `und` and `en` lanugages for
          // Drupal 8 at this time. The below response parsing will change when
          // more languages are supported.
          // REFER: TODO
          if (_ember['default'].isPresent(item._source.data.attributes.title)) {
            // Use `undefined` language, for title value, if it is present
            if (_ember['default'].isPresent(item._source.data.attributes.title.value.und)) {
              titleValue = item._source.data.attributes.title.value.und;
            }
            // Use overridden `english` lanugage, for title value, if it is present
            if (_ember['default'].isPresent(item._source.data.attributes.title.value.en)) {
              titleValue = item._source.data.attributes.title.value.en;
            }
          }
          if (_ember['default'].isPresent(item._source.data.attributes.body)) {
            // Use `undefined` language, for body value, if it is present
            if (_ember['default'].isPresent(item._source.data.attributes.body.value.und)) {
              bodyValue = JSON.parse(item._source.data.attributes.body.value.und).value;
            }
            // Use overridden `english` lanugage, for body value, if it is present
            if (_ember['default'].isPresent(item._source.data.attributes.body.value.en)) {
              bodyValue = JSON.parse(item._source.data.attributes.body.value.en).value;
            }
          }
          // Add item to searchResults only if title is set at this point
          if (_ember['default'].isPresent(titleValue)) {
            var processed_item = {
              "uuid": item._source.data.uuid,
              "title": titleValue,
              "body": bodyValue
            };
            self.get('searchResults').pushObject(processed_item);
          }
        });
      });
    },

    actions: {
      searchContentHubWithFilters: function searchContentHubWithFilters() {
        this.searchContentHub();
      },

      setFilterFromDate: function setFilterFromDate(date) {
        this.set('filterFromDate', date);
      },

      setFilterToDate: function setFilterToDate(date) {
        this.set('filterToDate', date);
      },

      importEntity: function importEntity() {

        // Get the host site baseURL
        var url = window.location !== window.parent.location ? document.referrer : document.location;
        var temp = url.split("/");
        var baseURL = temp[0] + "//" + temp[2];

        // Collect the searchResults that have been checked
        var checked = this.get('searchResults').filterBy('isChecked', true);

        // Proceed if we have checked something to be imported
        if (_ember['default'].isArray(checked) && _ember['default'].isPresent(checked)) {
          // Use the source platform (eg: wordpress, drupal7 or drupal8)
          // to make a call to correct REST API.
          if (_chEmberAppConfigEnvironment['default'].hostSourceType === 'wordpress') {
            _ember['default'].$.ajax({
              type: 'POST',
              crossOrigin: true,
              headers: {
                "Authorization": "Basic YWRtaW46YWRtaW4="
              },
              url: baseURL + '/wp-json/wp/v2/posts/',
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
                _ember['default'].$('.ch-success').text('Successfully imported entity with title ' + checked[0].title);
              },
              error: function error(request, textStatus, _error) {
                console.log(_error);
              }
            });
          } else if (_chEmberAppConfigEnvironment['default'].hostSourceType === 'drupal7') {
            _ember['default'].$.ajax({
              type: 'POST',
              crossOrigin: true,
              url: baseURL + '/node.json',
              data: '{ "title": "' + checked[0].get('title') + '", "type": "article"}',
              contentType: 'application/json',
              dataType: 'json',
              cache: false,
              success: function success() {
                _ember['default'].$('.ch-success').show();
                _ember['default'].$('.ch-success').text('Successfully imported entity with title - ' + checked[0].title);
              },
              error: function error(request, textStatus, _error2) {
                console.log(_error2);
              }
            });
          } else {
            _ember['default'].$.ajax({
              type: 'POST',
              crossOrigin: true,
              // NOTE: instead of sending one uuid, we will send an array of uuid's
              // when support for it is added on the Drupal 8 end.
              // REFER: TODO
              url: baseURL + '/acquia-contenthub/' + checked[0].uuid,
              dataType: 'json',
              contentType: 'application/json',
              cache: false,
              success: function success() {
                // NOTE: Currently Drupal 8 return's for the full node object on sucess.
                // It should instead return the success and/or error messages to show.
                // REFER: TODO
                _ember['default'].$('.ch-import-success').show();
                _ember['default'].$('.ch-import-success').text('Successfully imported entity with title - ' + checked[0].title);
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
define('ch-ember-app/components/ember-wormhole', ['exports', 'ember-wormhole/components/ember-wormhole'], function (exports, _emberWormholeComponentsEmberWormhole) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberWormholeComponentsEmberWormhole['default'];
    }
  });
});
define('ch-ember-app/components/pikaday-input', ['exports', 'ember', 'ember-pikaday/components/pikaday-input'], function (exports, _ember, _emberPikadayComponentsPikadayInput) {
  exports['default'] = _emberPikadayComponentsPikadayInput['default'];
});
define('ch-ember-app/components/power-select-multiple', ['exports', 'ember-power-select/components/power-select-multiple'], function (exports, _emberPowerSelectComponentsPowerSelectMultiple) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectComponentsPowerSelectMultiple['default'];
    }
  });
});
define('ch-ember-app/components/power-select-multiple/trigger', ['exports', 'ember-power-select/components/power-select-multiple/trigger'], function (exports, _emberPowerSelectComponentsPowerSelectMultipleTrigger) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectComponentsPowerSelectMultipleTrigger['default'];
    }
  });
});
define('ch-ember-app/components/power-select', ['exports', 'ember-power-select/components/power-select'], function (exports, _emberPowerSelectComponentsPowerSelect) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectComponentsPowerSelect['default'];
    }
  });
});
define('ch-ember-app/components/power-select/before-options', ['exports', 'ember-power-select/components/power-select/before-options'], function (exports, _emberPowerSelectComponentsPowerSelectBeforeOptions) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectComponentsPowerSelectBeforeOptions['default'];
    }
  });
});
define('ch-ember-app/components/power-select/options', ['exports', 'ember-power-select/components/power-select/options'], function (exports, _emberPowerSelectComponentsPowerSelectOptions) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectComponentsPowerSelectOptions['default'];
    }
  });
});
define('ch-ember-app/components/power-select/trigger', ['exports', 'ember-power-select/components/power-select/trigger'], function (exports, _emberPowerSelectComponentsPowerSelectTrigger) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectComponentsPowerSelectTrigger['default'];
    }
  });
});
define('ch-ember-app/helpers/and', ['exports', 'ember', 'ember-truth-helpers/helpers/and'], function (exports, _ember, _emberTruthHelpersHelpersAnd) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersAnd.andHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersAnd.andHelper);
  }

  exports['default'] = forExport;
});
define('ch-ember-app/helpers/ember-power-select-is-selected', ['exports', 'ember-power-select/helpers/ember-power-select-is-selected'], function (exports, _emberPowerSelectHelpersEmberPowerSelectIsSelected) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectHelpersEmberPowerSelectIsSelected['default'];
    }
  });
  Object.defineProperty(exports, 'emberPowerSelectIsSelected', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectHelpersEmberPowerSelectIsSelected.emberPowerSelectIsSelected;
    }
  });
});
define('ch-ember-app/helpers/ember-power-select-true-string-if-present', ['exports', 'ember-power-select/helpers/ember-power-select-true-string-if-present'], function (exports, _emberPowerSelectHelpersEmberPowerSelectTrueStringIfPresent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectHelpersEmberPowerSelectTrueStringIfPresent['default'];
    }
  });
  Object.defineProperty(exports, 'emberPowerSelectTrueStringIfPresent', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectHelpersEmberPowerSelectTrueStringIfPresent.emberPowerSelectTrueStringIfPresent;
    }
  });
});
define('ch-ember-app/helpers/eq', ['exports', 'ember', 'ember-truth-helpers/helpers/equal'], function (exports, _ember, _emberTruthHelpersHelpersEqual) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersEqual.equalHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersEqual.equalHelper);
  }

  exports['default'] = forExport;
});
define('ch-ember-app/helpers/gt', ['exports', 'ember', 'ember-truth-helpers/helpers/gt'], function (exports, _ember, _emberTruthHelpersHelpersGt) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersGt.gtHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersGt.gtHelper);
  }

  exports['default'] = forExport;
});
define('ch-ember-app/helpers/gte', ['exports', 'ember', 'ember-truth-helpers/helpers/gte'], function (exports, _ember, _emberTruthHelpersHelpersGte) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersGte.gteHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersGte.gteHelper);
  }

  exports['default'] = forExport;
});
define('ch-ember-app/helpers/is-array', ['exports', 'ember', 'ember-truth-helpers/helpers/is-array'], function (exports, _ember, _emberTruthHelpersHelpersIsArray) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersIsArray.isArrayHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersIsArray.isArrayHelper);
  }

  exports['default'] = forExport;
});
define('ch-ember-app/helpers/lt', ['exports', 'ember', 'ember-truth-helpers/helpers/lt'], function (exports, _ember, _emberTruthHelpersHelpersLt) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersLt.ltHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersLt.ltHelper);
  }

  exports['default'] = forExport;
});
define('ch-ember-app/helpers/lte', ['exports', 'ember', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _emberTruthHelpersHelpersLte) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersLte.lteHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersLte.lteHelper);
  }

  exports['default'] = forExport;
});
define('ch-ember-app/helpers/not-eq', ['exports', 'ember', 'ember-truth-helpers/helpers/not-equal'], function (exports, _ember, _emberTruthHelpersHelpersNotEqual) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersNotEqual.notEqualHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersNotEqual.notEqualHelper);
  }

  exports['default'] = forExport;
});
define('ch-ember-app/helpers/not', ['exports', 'ember', 'ember-truth-helpers/helpers/not'], function (exports, _ember, _emberTruthHelpersHelpersNot) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersNot.notHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersNot.notHelper);
  }

  exports['default'] = forExport;
});
define('ch-ember-app/helpers/or', ['exports', 'ember', 'ember-truth-helpers/helpers/or'], function (exports, _ember, _emberTruthHelpersHelpersOr) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersOr.orHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersOr.orHelper);
  }

  exports['default'] = forExport;
});
define('ch-ember-app/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('ch-ember-app/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('ch-ember-app/helpers/xor', ['exports', 'ember', 'ember-truth-helpers/helpers/xor'], function (exports, _ember, _emberTruthHelpersHelpersXor) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersXor.xorHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersXor.xorHelper);
  }

  exports['default'] = forExport;
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
define('ch-ember-app/initializers/truth-helpers', ['exports', 'ember', 'ember-truth-helpers/utils/register-helper', 'ember-truth-helpers/helpers/and', 'ember-truth-helpers/helpers/or', 'ember-truth-helpers/helpers/equal', 'ember-truth-helpers/helpers/not', 'ember-truth-helpers/helpers/is-array', 'ember-truth-helpers/helpers/not-equal', 'ember-truth-helpers/helpers/gt', 'ember-truth-helpers/helpers/gte', 'ember-truth-helpers/helpers/lt', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _emberTruthHelpersUtilsRegisterHelper, _emberTruthHelpersHelpersAnd, _emberTruthHelpersHelpersOr, _emberTruthHelpersHelpersEqual, _emberTruthHelpersHelpersNot, _emberTruthHelpersHelpersIsArray, _emberTruthHelpersHelpersNotEqual, _emberTruthHelpersHelpersGt, _emberTruthHelpersHelpersGte, _emberTruthHelpersHelpersLt, _emberTruthHelpersHelpersLte) {
  exports.initialize = initialize;

  function initialize() /* container, application */{

    // Do not register helpers from Ember 1.13 onwards, starting from 1.13 they
    // will be auto-discovered.
    if (_ember['default'].Helper) {
      return;
    }

    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('and', _emberTruthHelpersHelpersAnd.andHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('or', _emberTruthHelpersHelpersOr.orHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('eq', _emberTruthHelpersHelpersEqual.equalHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('not', _emberTruthHelpersHelpersNot.notHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('is-array', _emberTruthHelpersHelpersIsArray.isArrayHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('not-eq', _emberTruthHelpersHelpersNotEqual.notEqualHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('gt', _emberTruthHelpersHelpersGt.gtHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('gte', _emberTruthHelpersHelpersGte.gteHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('lt', _emberTruthHelpersHelpersLt.ltHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('lte', _emberTruthHelpersHelpersLte.lteHelper);
  }

  exports['default'] = {
    name: 'truth-helpers',
    initialize: initialize
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
define('ch-ember-app/models/client', ['exports', 'ember-data/model', 'ember-data/attr'], function (exports, _emberDataModel, _emberDataAttr) {
  exports['default'] = _emberDataModel['default'].extend({
    // Common CDF properties
    uuid: (0, _emberDataAttr['default'])('string'),
    name: (0, _emberDataAttr['default'])('string')

    // TODO relationships

    // TODO computed properties
  });
});
define('ch-ember-app/models/entity', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _emberDataModel, _emberDataAttr, _emberDataRelationships) {
  exports['default'] = _emberDataModel['default'].extend({
    // Common CDF properties
    uuid: (0, _emberDataAttr['default'])('string'),
    modified: (0, _emberDataAttr['default'])('date'),
    created: (0, _emberDataAttr['default'])('date'),
    origin: (0, _emberDataRelationships.belongsTo)('client'),
    type: (0, _emberDataAttr['default'])('string'),
    attributes: (0, _emberDataAttr['default'])('string')

    // TODO relationships

    // TODO computed properties
  });
});
define('ch-ember-app/models/search-result', ['exports', 'ch-ember-app/models/entity', 'ember-data/attr'], function (exports, _chEmberAppModelsEntity, _emberDataAttr) {
  exports['default'] = _chEmberAppModelsEntity['default'].extend({
    title: (0, _emberDataAttr['default'])('string'),
    summary: (0, _emberDataAttr['default'])('string')

    // TODO relationships

    // TODO computed properties
  });
});
define('ch-ember-app/models/tag', ['exports', 'ch-ember-app/models/entity', 'ember-data/attr'], function (exports, _chEmberAppModelsEntity, _emberDataAttr) {
  exports['default'] = _chEmberAppModelsEntity['default'].extend({
    name: (0, _emberDataAttr['default'])('string')

    // TODO relationships

    // TODO computed properties
  });
});
define('ch-ember-app/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('ch-ember-app/router', ['exports', 'ember', 'ch-ember-app/config/environment'], function (exports, _ember, _chEmberAppConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _chEmberAppConfigEnvironment['default'].locationType
  });

  Router.map(function () {});

  exports['default'] = Router;
});
define('ch-ember-app/routes/application', ['exports', 'ember', 'ch-ember-app/config/environment'], function (exports, _ember, _chEmberAppConfigEnvironment) {
	exports['default'] = _ember['default'].Route.extend({
		requestSigner: _ember['default'].inject.service(),
		beforeModel: function beforeModel() {
			var _this = this,
			    _arguments = arguments;

			// Configure the Ember Data Store to talk to Content Hub Plexus
			// by setting the right host in adapter and ensuring http-hmac request signing.
			// NOTE: The config values we need to do that, are read from the host client
			// in the ember app initializer.
			return new _ember['default'].RSVP.Promise(function (resolve) {
				var receiveMessage = function receiveMessage(event) {
					if (_ember['default'].isPresent(event.data.client)) {
						// Read data posted by Host into Ember ENV
						_chEmberAppConfigEnvironment['default'].contentHubRealm = 'Plexus';
						_chEmberAppConfigEnvironment['default'].hostSourceType = event.data.source;
						_chEmberAppConfigEnvironment['default'].hostClientId = event.data.client;
						_chEmberAppConfigEnvironment['default'].contentHubHost = event.data.host;
						_chEmberAppConfigEnvironment['default'].contentHubAPIKey = event.data.public_key;
						_chEmberAppConfigEnvironment['default'].contentHubSecretKey = event.data.secret_key;
						// Sign store requests to Plexus using ENV data
						var headers = {
							'X-Acquia-Plexus-Client-Id': _chEmberAppConfigEnvironment['default'].hostClientId
						};
						_this._super.apply(_this, _arguments);
						var signer = _this.get('requestSigner');
						_this.store.adapterFor('application').set('host', _chEmberAppConfigEnvironment['default'].contentHubHost);
						_this.store.adapterFor('application').set('headers', headers);
						signer.set('realm', _chEmberAppConfigEnvironment['default'].contentHubRealm);
						signer.set('publicKey', _chEmberAppConfigEnvironment['default'].contentHubAPIKey);
						signer.set('secretKey', _chEmberAppConfigEnvironment['default'].contentHubSecretKey);
						signer.set('signedHeader', ['X-Acquia-Plexus-Client-Id']);
						signer.initializeSigner();
						resolve();
					}
					// NOTE: When the Host client is not yet configured, the Ember app should
					// show helpful instructions to do so. Perhaps as it returns a `reject` here.
					// REFER: TODO
				};
				window.addEventListener("message", receiveMessage, false);
			});
		},

		model: function model() {
			return _ember['default'].RSVP.hash({
				client: this.store.query('client', {}),
				tag: this.store.query('entity', {
					type: 'taxonomy_term',
					fields: 'name'
				})
			});
		},

		setupController: function setupController(controller, models) {
			controller.setProperties(models);
		}

	});
});
define('ch-ember-app/serializers/client', ['exports', 'ember-data/serializers/rest'], function (exports, _emberDataSerializersRest) {
  exports['default'] = _emberDataSerializersRest['default'].extend({
    normalizeResponse: function normalizeResponse(store, primaryModelClass, payload) {
      return {
        data: payload.clients.map(function (info) {
          return {
            id: info.uuid,
            type: primaryModelClass.modelName,
            attributes: info
          };
        })
      };
    }
  });
});
define('ch-ember-app/serializers/entity', ['exports', 'ember', 'ember-data/serializers/rest'], function (exports, _ember, _emberDataSerializersRest) {
  exports['default'] = _emberDataSerializersRest['default'].extend({
    // Even though we set primary key to another string
    // ember still requires an `id` attribute in a model instance.
    primaryKey: 'uuid',

    // Serialize CDF coming down from plexus to JSONAPI format
    // Refer: http://jsonapi.org/examples/
    normalizeResponse: function normalizeResponse(store, primaryModelClass, payload) {
      // Proceed only if we have successful response with some data
      if (_ember['default'].isPresent(payload.success) && _ember['default'].isPresent(payload.data)) {
        return {
          data: payload.data.map(function (info) {
            // Set what modelType should the data by mapped to
            var typeValue = "entity";

            if (info.type === 'taxonomy_term') {
              typeValue = "tag";
              info.attributes.modified = info.modified;
              info.attributes.uuid = info.uuid;
              info.attributes.created = info.created;
              // Extract name whether it is english or undefined language
              var nameAttrValue = "";
              if (_ember['default'].isPresent(info.attributes.name.und)) {
                nameAttrValue = info.attributes.name.und;
              } else if (_ember['default'].isPresent(info.attributes.name.en)) {
                nameAttrValue = info.attributes.name.en;
              }
              info.attributes.name = nameAttrValue;
              return {
                id: info.uuid,
                type: typeValue,
                attributes: info.attributes
              };
            } else {
              info.attributes.modified = info.modified;
              info.attributes.uuid = info.uuid;
              info.attributes.created = info.created;
              return {
                id: info.uuid,
                type: typeValue,
                attributes: info.attributes
              };
            }
          })
        };
      } else {
        // As per JSON API spec, we should return empty stuff like below
        // REFER: https://github.com/json-api/json-api/issues/101
        // REFER: https://github.com/json-api/json-api/pull/341
        return {
          data: []
        };
      }
    }
  });
});
define('ch-ember-app/serializers/tag', ['exports', 'ember-data/serializers/rest'], function (exports, _emberDataSerializersRest) {
  exports['default'] = _emberDataSerializersRest['default'].extend({
    normalizeResponse: function normalizeResponse() {
      return this['super'].apply(this, arguments);
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
define('ch-ember-app/services/text-measurer', ['exports', 'ember-text-measurer/services/text-measurer'], function (exports, _emberTextMeasurerServicesTextMeasurer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberTextMeasurerServicesTextMeasurer['default'];
    }
  });
});
define("ch-ember-app/templates/application", ["exports"], function (exports) {
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
                "line": 5,
                "column": 1
              },
              "end": {
                "line": 11,
                "column": 1
              }
            },
            "moduleName": "ch-ember-app/templates/application.hbs"
          },
          isEmpty: false,
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("		");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            dom.setAttribute(el1, "class", "ch-row");
            var el2 = dom.createTextNode("\n		");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n		");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("h3");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("br");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n		");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("br");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n		");
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
            morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
            morphs[2] = dom.createMorphAt(element0, 6, 6);
            return morphs;
          },
          statements: [["inline", "input", [], ["type", "checkbox", "id", ["subexpr", "@mut", [["get", "data.uuid", ["loc", [null, [7, 29], [7, 38]]]]], [], []]], ["loc", [null, [7, 2], [7, 40]]]], ["content", "data.attributes.title.und", ["loc", [null, [8, 6], [8, 35]]]], ["content", "data.attributes.body.und", ["loc", [null, [9, 2], [9, 30]]]]],
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
          "moduleName": "ch-ember-app/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("	");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "ch-discovery-page");
          var el2 = dom.createTextNode("\n	");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2, "type", "button");
          dom.setAttribute(el2, "class", "btn btn-danger");
          var el3 = dom.createTextNode("NEXT - On clicking submit button, build ES query");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n	");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("ul");
          dom.setAttribute(el2, "class", "ch-list");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("	");
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
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 3]), 1, 1);
          return morphs;
        },
        statements: [["block", "each", [["get", "model", ["loc", [null, [5, 9], [5, 14]]]]], [], 0, null, ["loc", [null, [5, 1], [11, 10]]]]],
        locals: [],
        templates: [child0]
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
            "line": 15,
            "column": 0
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
      statements: [["block", "discovery-page", [], ["tags", ["subexpr", "@mut", [["get", "tag", ["loc", [null, [1, 23], [1, 26]]]]], [], []], "sources", ["subexpr", "@mut", [["get", "client", ["loc", [null, [1, 35], [1, 41]]]]], [], []]], 0, null, ["loc", [null, [1, 0], [14, 19]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("ch-ember-app/templates/components/discovery-page", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 49,
              "column": 18
            },
            "end": {
              "line": 57,
              "column": 18
            }
          },
          "moduleName": "ch-ember-app/templates/components/discovery-page.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
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
        statements: [["content", "source.name", ["loc", [null, [56, 20], [56, 35]]]]],
        locals: ["source"],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 60,
              "column": 18
            },
            "end": {
              "line": 68,
              "column": 18
            }
          },
          "moduleName": "ch-ember-app/templates/components/discovery-page.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
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
        statements: [["content", "tag.name", ["loc", [null, [67, 20], [67, 32]]]]],
        locals: ["tag"],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 89,
              "column": 2
            },
            "end": {
              "line": 96,
              "column": 2
            }
          },
          "moduleName": "ch-ember-app/templates/components/discovery-page.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "ch-callout contenthub-search-item-row");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h3");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(element1, 0, 0);
          morphs[1] = dom.createMorphAt(element1, 2, 2);
          morphs[2] = dom.createMorphAt(dom.childAt(element0, [3]), 1, 1);
          return morphs;
        },
        statements: [["inline", "input", [], ["type", "checkbox", "id", ["subexpr", "@mut", [["get", "item.uuid", ["loc", [null, [91, 35], [91, 44]]]]], [], []], "name", ["subexpr", "@mut", [["get", "item.uuid", ["loc", [null, [91, 50], [91, 59]]]]], [], []], "checked", ["subexpr", "@mut", [["get", "item.isChecked", ["loc", [null, [91, 68], [91, 82]]]]], [], []]], ["loc", [null, [91, 8], [91, 84]]]], ["content", "item.title", ["loc", [null, [91, 85], [91, 99]]]], ["content", "item.body", ["loc", [null, [93, 6], [93, 19]]]]],
        locals: ["item"],
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
            "line": 106,
            "column": 0
          }
        },
        "moduleName": "ch-ember-app/templates/components/discovery-page.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container-fluid");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-sm-3 col-md-2 sidebar");
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "row content-hub-branding");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "media");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "media-left");
        var el7 = dom.createTextNode("\n              ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("img");
        dom.setAttribute(el7, "class", "media-object");
        dom.setAttribute(el7, "src", "assets/images/content-hub-logo-sm.png");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "media-body media-middle");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("h4");
        dom.setAttribute(el7, "class", "media-heading");
        var el8 = dom.createTextNode("Acquia content hub");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4, "class", "nav nav-sidebar");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.setAttribute(el5, "class", "active");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "href", "#");
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "glyphicon glyphicon-search");
        dom.setAttribute(el7, "aria-hidden", "true");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" Content discovery ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "sr-only");
        var el8 = dom.createTextNode("(current)");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "href", "#");
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "glyphicon glyphicon-filter");
        dom.setAttribute(el7, "aria-hidden", "true");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" Saved Filters");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "href", "#");
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "glyphicon glyphicon-bell");
        dom.setAttribute(el7, "aria-hidden", "true");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" Notifications");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "ch-import-success alert alert-success");
        dom.setAttribute(el4, "role", "alert");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h1");
        dom.setAttribute(el4, "class", "page-header");
        var el5 = dom.createTextNode("Content Discovery");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "panel panel-default");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "panel-body");
        var el6 = dom.createTextNode("\n            ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("form");
        dom.setAttribute(el6, "class", "form");
        var el7 = dom.createTextNode("\n              ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "row");
        var el8 = dom.createTextNode("\n                ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "col-xs-4");
        var el9 = dom.createTextNode("\n                  ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9, "class", "form-group");
        var el10 = dom.createTextNode("\n                    ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("label");
        dom.setAttribute(el10, "class", "sr-only");
        dom.setAttribute(el10, "for", "searchKeywords");
        var el11 = dom.createTextNode("Search keywords");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                    ");
        dom.appendChild(el9, el10);
        var el10 = dom.createComment("");
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "col-xs-2");
        var el9 = dom.createTextNode("\n                  ");
        dom.appendChild(el8, el9);
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                  ");
        dom.appendChild(el8, el9);
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "col-xs-2");
        var el9 = dom.createTextNode("\n");
        dom.appendChild(el8, el9);
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("                ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "col-xs-2");
        var el9 = dom.createTextNode("\n");
        dom.appendChild(el8, el9);
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("                ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "col-xs-2");
        var el9 = dom.createTextNode("\n                  ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("button");
        dom.setAttribute(el9, "class", "btn btn-primary");
        var el10 = dom.createTextNode("Search");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n            ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("form");
        dom.setAttribute(el6, "class", "form");
        var el7 = dom.createTextNode("\n              ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "row");
        var el8 = dom.createTextNode("\n                ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "col-xs-12");
        var el9 = dom.createTextNode("\n                  ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("button");
        dom.setAttribute(el9, "type", "button");
        dom.setAttribute(el9, "class", "btn btn-primary");
        var el10 = dom.createTextNode("Import to site");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n\n\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
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
        var element2 = dom.childAt(fragment, [0, 1, 3]);
        var element3 = dom.childAt(element2, [5, 1]);
        var element4 = dom.childAt(element3, [1, 1]);
        var element5 = dom.childAt(element4, [3]);
        var element6 = dom.childAt(element4, [9, 1]);
        var element7 = dom.childAt(element3, [3, 1, 1, 1]);
        var morphs = new Array(8);
        morphs[0] = dom.createMorphAt(dom.childAt(element4, [1, 1]), 3, 3);
        morphs[1] = dom.createMorphAt(element5, 1, 1);
        morphs[2] = dom.createMorphAt(element5, 3, 3);
        morphs[3] = dom.createMorphAt(dom.childAt(element4, [5]), 1, 1);
        morphs[4] = dom.createMorphAt(dom.childAt(element4, [7]), 1, 1);
        morphs[5] = dom.createElementMorph(element6);
        morphs[6] = dom.createElementMorph(element7);
        morphs[7] = dom.createMorphAt(dom.childAt(element2, [7]), 1, 1);
        return morphs;
      },
      statements: [["inline", "input", [], ["type", "text", "name", "searchKeywords", "value", ["subexpr", "@mut", [["get", "searchKeyword", ["loc", [null, [41, 68], [41, 81]]]]], [], []], "class", "form-control", "placeholder", "Search keywords ..."], ["loc", [null, [41, 20], [41, 138]]]], ["inline", "pikaday-input", [], ["value", ["subexpr", "@mut", [["get", "filterFromDate", ["loc", [null, [45, 40], [45, 54]]]]], [], []], "format", "MM-DD-YYYY", "placeholder", "From Date ...", "onSelection", ["subexpr", "action", ["setFilterFromDate"], [], ["loc", [null, [45, 115], [45, 143]]]]], ["loc", [null, [45, 18], [45, 145]]]], ["inline", "pikaday-input", [], ["value", ["subexpr", "@mut", [["get", "filterToDate", ["loc", [null, [46, 40], [46, 52]]]]], [], []], "format", "MM-DD-YYYY", "placeholder", "To Date ...", "onSelection", ["subexpr", "action", ["setFilterToDate"], [], ["loc", [null, [46, 111], [46, 137]]]]], ["loc", [null, [46, 18], [46, 139]]]], ["block", "power-select-multiple", [], ["options", ["subexpr", "@mut", [["get", "sources", ["loc", [null, [50, 29], [50, 36]]]]], [], []], "selected", ["subexpr", "@mut", [["get", "selectedSource", ["loc", [null, [51, 30], [51, 44]]]]], [], []], "placeholder", "Source / Origin ...", "onchange", ["subexpr", "action", [["subexpr", "mut", [["get", "selectedSource", ["loc", [null, [53, 43], [53, 57]]]]], [], ["loc", [null, [53, 38], [53, 58]]]]], [], ["loc", [null, [53, 30], [53, 59]]]]], 0, null, ["loc", [null, [49, 18], [57, 44]]]], ["block", "power-select-multiple", [], ["options", ["subexpr", "@mut", [["get", "tags", ["loc", [null, [61, 29], [61, 33]]]]], [], []], "selected", ["subexpr", "@mut", [["get", "selectedTag", ["loc", [null, [62, 30], [62, 41]]]]], [], []], "placeholder", "Tags ...", "onchange", ["subexpr", "action", [["subexpr", "mut", [["get", "selectedTag", ["loc", [null, [64, 43], [64, 54]]]]], [], ["loc", [null, [64, 38], [64, 55]]]]], [], ["loc", [null, [64, 30], [64, 56]]]]], 1, null, ["loc", [null, [60, 18], [68, 44]]]], ["element", "action", ["searchContentHubWithFilters"], [], ["loc", [null, [71, 50], [71, 90]]]], ["element", "action", ["importEntity"], [], ["loc", [null, [79, 64], [79, 89]]]], ["block", "each", [["get", "searchResults", ["loc", [null, [89, 10], [89, 23]]]]], [], 2, null, ["loc", [null, [89, 2], [96, 11]]]]],
      locals: [],
      templates: [child0, child1, child2]
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
  require("ch-ember-app/app")["default"].create({"name":"ch-ember-app","version":"0.0.0+43bc6a16"});
}

/* jshint ignore:end */
//# sourceMappingURL=ch-ember-app.map