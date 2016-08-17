define('ch-ember-app/tests/adapters/application.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | adapters/application.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/application.js should pass jshint.');
  });
});
define('ch-ember-app/tests/app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass jshint.');
  });
});
define('ch-ember-app/tests/components/discovery-page.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/discovery-page.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/discovery-page.js should pass jshint.');
  });
});
define('ch-ember-app/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = destroyApp;

  function destroyApp(application) {
    _ember['default'].run(application, 'destroy');
  }
});
define('ch-ember-app/tests/helpers/destroy-app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/destroy-app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass jshint.');
  });
});
define('ch-ember-app/tests/helpers/ember-basic-dropdown', ['exports', 'ember', 'ember-runloop'], function (exports, _ember, _emberRunloop) {
  exports.nativeClick = nativeClick;
  exports.clickTrigger = clickTrigger;
  exports.tapTrigger = tapTrigger;
  exports.fireKeydown = fireKeydown;

  // integration helpers
  function focus(el) {
    if (!el) {
      return;
    }
    var $el = jQuery(el);
    if ($el.is(':input, [contenteditable=true]')) {
      var type = $el.prop('type');
      if (type !== 'checkbox' && type !== 'radio' && type !== 'hidden') {
        (0, _emberRunloop['default'])(null, function () {
          // Firefox does not trigger the `focusin` event if the window
          // does not have focus. If the document doesn't have focus just
          // use trigger('focusin') instead.

          if (!document.hasFocus || document.hasFocus()) {
            el.focus();
          } else {
            $el.trigger('focusin');
          }
        });
      }
    }
  }

  function nativeClick(selector) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var mousedown = new window.Event('mousedown', { bubbles: true, cancelable: true, view: window });
    var mouseup = new window.Event('mouseup', { bubbles: true, cancelable: true, view: window });
    var click = new window.Event('click', { bubbles: true, cancelable: true, view: window });
    Object.keys(options).forEach(function (key) {
      mousedown[key] = options[key];
      mouseup[key] = options[key];
      click[key] = options[key];
    });
    var element = document.querySelector(selector);
    (0, _emberRunloop['default'])(function () {
      return element.dispatchEvent(mousedown);
    });
    focus(element);
    (0, _emberRunloop['default'])(function () {
      return element.dispatchEvent(mouseup);
    });
    (0, _emberRunloop['default'])(function () {
      return element.dispatchEvent(click);
    });
  }

  function clickTrigger(scope) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var selector = '.ember-basic-dropdown-trigger';
    if (scope) {
      selector = scope + ' ' + selector;
    }
    nativeClick(selector, options);
  }

  function tapTrigger(scope) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var selector = '.ember-basic-dropdown-trigger';
    if (scope) {
      selector = scope + ' ' + selector;
    }
    var touchStartEvent = new window.Event('touchstart', { bubbles: true, cancelable: true, view: window });
    Object.keys(options).forEach(function (key) {
      return touchStartEvent[key] = options[key];
    });
    (0, _emberRunloop['default'])(function () {
      return document.querySelector(selector).dispatchEvent(touchStartEvent);
    });
    var touchEndEvent = new window.Event('touchend', { bubbles: true, cancelable: true, view: window });
    Object.keys(options).forEach(function (key) {
      return touchEndEvent[key] = options[key];
    });
    (0, _emberRunloop['default'])(function () {
      return document.querySelector(selector).dispatchEvent(touchEndEvent);
    });
  }

  function fireKeydown(selector, k) {
    var oEvent = document.createEvent('Events');
    oEvent.initEvent('keydown', true, true);
    $.extend(oEvent, {
      view: window,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      keyCode: k,
      charCode: k
    });
    (0, _emberRunloop['default'])(function () {
      return document.querySelector(selector).dispatchEvent(oEvent);
    });
  }

  // acceptance helpers

  exports['default'] = function () {
    _ember['default'].Test.registerAsyncHelper('clickDropdown', function (app, cssPath) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      clickTrigger(cssPath, options);
    });

    _ember['default'].Test.registerAsyncHelper('tapDropdown', function (app, cssPath) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      tapTrigger(cssPath, options);
    });
  };
});
define('ch-ember-app/tests/helpers/ember-power-select', ['exports', 'jquery', 'ember-runloop', 'ember-test'], function (exports, _jquery, _emberRunloop, _emberTest) {
  exports.nativeMouseDown = nativeMouseDown;
  exports.nativeMouseUp = nativeMouseUp;
  exports.triggerKeydown = triggerKeydown;
  exports.typeInSearch = typeInSearch;
  exports.clickTrigger = clickTrigger;
  exports.nativeTouch = nativeTouch;
  exports.touchTrigger = touchTrigger;

  // Helpers for integration tests

  function typeText(selector, text) {
    var $selector = (0, _jquery['default'])((0, _jquery['default'])(selector).get(0)); // Only interact with the first result
    $selector.val(text);
    var event = document.createEvent('Events');
    event.initEvent('input', true, true);
    $selector[0].dispatchEvent(event);
  }

  function fireNativeMouseEvent(eventType, selectorOrDomElement) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var event = new window.Event(eventType, { bubbles: true, cancelable: true, view: window });
    Object.keys(options).forEach(function (key) {
      return event[key] = options[key];
    });
    var target = undefined;
    if (typeof selectorOrDomElement === 'string') {
      target = (0, _jquery['default'])(selectorOrDomElement)[0];
    } else {
      target = selectorOrDomElement;
    }
    (0, _emberRunloop['default'])(function () {
      return target.dispatchEvent(event);
    });
  }

  function nativeMouseDown(selectorOrDomElement, options) {
    fireNativeMouseEvent('mousedown', selectorOrDomElement, options);
  }

  function nativeMouseUp(selectorOrDomElement, options) {
    fireNativeMouseEvent('mouseup', selectorOrDomElement, options);
  }

  function triggerKeydown(domElement, k) {
    var oEvent = document.createEvent('Events');
    oEvent.initEvent('keydown', true, true);
    _jquery['default'].extend(oEvent, {
      view: window,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      keyCode: k,
      charCode: k
    });
    (0, _emberRunloop['default'])(function () {
      domElement.dispatchEvent(oEvent);
    });
  }

  function typeInSearch(text) {
    (0, _emberRunloop['default'])(function () {
      typeText('.ember-power-select-search-input, .ember-power-select-search input, .ember-power-select-trigger-multiple-input, input[type="search"]', text);
    });
  }

  function clickTrigger(scope) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var selector = '.ember-power-select-trigger';
    if (scope) {
      selector = scope + ' ' + selector;
    }
    nativeMouseDown(selector, options);
  }

  function nativeTouch(selectorOrDomElement) {
    var event = new window.Event('touchstart', { bubbles: true, cancelable: true, view: window });
    var target = undefined;

    if (typeof selectorOrDomElement === 'string') {
      target = (0, _jquery['default'])(selectorOrDomElement)[0];
    } else {
      target = selectorOrDomElement;
    }
    (0, _emberRunloop['default'])(function () {
      return target.dispatchEvent(event);
    });
    (0, _emberRunloop['default'])(function () {
      event = new window.Event('touchend', { bubbles: true, cancelable: true, view: window });
      target.dispatchEvent(event);
    });
  }

  function touchTrigger() {
    var selector = '.ember-power-select-trigger';
    nativeTouch(selector);
  }

  // Helpers for acceptance tests

  exports['default'] = function () {
    _emberTest['default'].registerAsyncHelper('selectChoose', function (app, cssPath, value) {
      var $trigger = find(cssPath).find('.ember-power-select-trigger');
      var contentId = '' + $trigger.attr('aria-controls');
      var $content = find('#' + contentId);
      // If the dropdown is closed, open it
      if ($content.length === 0) {
        nativeMouseDown(cssPath + ' .ember-power-select-trigger');
        wait();
      }

      // Select the option with the given text
      andThen(function () {
        var potentialTargets = (0, _jquery['default'])('#' + contentId + ' .ember-power-select-option:contains("' + value + '")').toArray();
        var target = undefined;
        if (potentialTargets.length > 1) {
          target = potentialTargets.filter(function (t) {
            return t.textContent.trim() === value;
          })[0] || potentialTargets[0];
        } else {
          target = potentialTargets[0];
        }
        nativeMouseUp(target);
      });
    });

    _emberTest['default'].registerAsyncHelper('selectSearch', function (app, cssPath, value) {
      var $trigger = find(cssPath).find('.ember-power-select-trigger');
      var contentId = '' + $trigger.attr('aria-controls');
      var isMultipleSelect = (0, _jquery['default'])(cssPath + ' .ember-power-select-trigger-multiple-input').length > 0;

      var dropdownIsClosed = (0, _jquery['default'])('#' + contentId).length === 0;
      if (dropdownIsClosed) {
        nativeMouseDown(cssPath + ' .ember-power-select-trigger');
        wait();
      }
      var isDefaultSingleSelect = (0, _jquery['default'])('.ember-power-select-search-input').length > 0;

      if (isMultipleSelect) {
        fillIn(cssPath + ' .ember-power-select-trigger-multiple-input', value);
      } else if (isDefaultSingleSelect) {
        fillIn('.ember-power-select-search-input', value);
      } else {
        // It's probably a customized version
        var inputIsInTrigger = !!find(cssPath + ' .ember-power-select-trigger input[type=search]')[0];
        if (inputIsInTrigger) {
          fillIn(cssPath + ' .ember-power-select-trigger input[type=search]', value);
        } else {
          fillIn('#' + contentId + ' .ember-power-select-search-input[type=search]', 'input');
        }
      }
    });

    _emberTest['default'].registerAsyncHelper('removeMultipleOption', function (app, cssPath, value) {
      var elem = find(cssPath + ' .ember-power-select-multiple-options > li:contains(' + value + ') > .ember-power-select-multiple-remove-btn').get(0);
      try {
        nativeMouseDown(elem);
        wait();
      } catch (e) {
        console.warn('css path to remove btn not found');
        throw e;
      }
    });

    _emberTest['default'].registerAsyncHelper('clearSelected', function (app, cssPath) {
      var elem = find(cssPath + ' .ember-power-select-clear-btn').get(0);
      try {
        nativeMouseDown(elem);
        wait();
      } catch (e) {
        console.warn('css path to clear btn not found');
        throw e;
      }
    });
  };
});
define('ch-ember-app/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'ch-ember-app/tests/helpers/start-app', 'ch-ember-app/tests/helpers/destroy-app'], function (exports, _qunit, _chEmberAppTestsHelpersStartApp, _chEmberAppTestsHelpersDestroyApp) {
  exports['default'] = function (name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _chEmberAppTestsHelpersStartApp['default'])();

        if (options.beforeEach) {
          options.beforeEach.apply(this, arguments);
        }
      },

      afterEach: function afterEach() {
        if (options.afterEach) {
          options.afterEach.apply(this, arguments);
        }

        (0, _chEmberAppTestsHelpersDestroyApp['default'])(this.application);
      }
    });
  };
});
define('ch-ember-app/tests/helpers/module-for-acceptance.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/module-for-acceptance.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass jshint.');
  });
});
define('ch-ember-app/tests/helpers/resolver', ['exports', 'ch-ember-app/resolver', 'ch-ember-app/config/environment'], function (exports, _chEmberAppResolver, _chEmberAppConfigEnvironment) {

  var resolver = _chEmberAppResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _chEmberAppConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _chEmberAppConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});
define('ch-ember-app/tests/helpers/resolver.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/resolver.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass jshint.');
  });
});
define('ch-ember-app/tests/helpers/start-app', ['exports', 'ember', 'ch-ember-app/app', 'ch-ember-app/config/environment'], function (exports, _ember, _chEmberAppApp, _chEmberAppConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    var attributes = _ember['default'].merge({}, _chEmberAppConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    _ember['default'].run(function () {
      application = _chEmberAppApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});
define('ch-ember-app/tests/helpers/start-app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/start-app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass jshint.');
  });
});
define('ch-ember-app/tests/integration/components/discovery-page-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('discovery-page', 'Integration | Component | discovery page', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.5.1',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 18
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
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
        statements: [['content', 'discovery-page', ['loc', [null, [1, 0], [1, 18]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'fragmentReason': false,
            'revision': 'Ember@2.5.1',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.5.1',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'discovery-page', [], [], 0, null, ['loc', [null, [2, 4], [4, 23]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('ch-ember-app/tests/integration/components/discovery-page-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | integration/components/discovery-page-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/discovery-page-test.js should pass jshint.');
  });
});
define('ch-ember-app/tests/models/client.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | models/client.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/client.js should pass jshint.');
  });
});
define('ch-ember-app/tests/models/entity.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | models/entity.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/entity.js should pass jshint.');
  });
});
define('ch-ember-app/tests/models/search-result.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | models/search-result.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/search-result.js should pass jshint.');
  });
});
define('ch-ember-app/tests/models/tag.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | models/tag.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/tag.js should pass jshint.');
  });
});
define('ch-ember-app/tests/resolver.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | resolver.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass jshint.');
  });
});
define('ch-ember-app/tests/router.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | router.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass jshint.');
  });
});
define('ch-ember-app/tests/routes/application.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/application.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/application.js should pass jshint.');
  });
});
define('ch-ember-app/tests/serializers/client.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | serializers/client.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/client.js should pass jshint.');
  });
});
define('ch-ember-app/tests/serializers/entity.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | serializers/entity.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/entity.js should pass jshint.');
  });
});
define('ch-ember-app/tests/serializers/tag.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | serializers/tag.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/tag.js should pass jshint.');
  });
});
define('ch-ember-app/tests/test-helper', ['exports', 'ch-ember-app/tests/helpers/resolver', 'ember-qunit'], function (exports, _chEmberAppTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_chEmberAppTestsHelpersResolver['default']);
});
define('ch-ember-app/tests/test-helper.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | test-helper.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass jshint.');
  });
});
define('ch-ember-app/tests/unit/adapters/application-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('adapter:application', 'Unit | Adapter | application', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var adapter = this.subject();
    assert.ok(adapter);
  });
});
define('ch-ember-app/tests/unit/adapters/application-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/adapters/application-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/adapters/application-test.js should pass jshint.');
  });
});
define('ch-ember-app/tests/unit/controllers/entity-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:entity', 'Unit | Controller | entity', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('ch-ember-app/tests/unit/controllers/entity-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/controllers/entity-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/entity-test.js should pass jshint.');
  });
});
define('ch-ember-app/tests/unit/mixins/hmac-adapter-mixin-test', ['exports', 'ember', 'ch-ember-app/mixins/hmac-adapter-mixin', 'qunit'], function (exports, _ember, _chEmberAppMixinsHmacAdapterMixin, _qunit) {

  (0, _qunit.module)('Unit | Mixin | hmac adapter mixin');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var HmacAdapterMixinObject = _ember['default'].Object.extend(_chEmberAppMixinsHmacAdapterMixin['default']);
    var subject = HmacAdapterMixinObject.create();
    assert.ok(subject);
  });
});
define('ch-ember-app/tests/unit/mixins/hmac-adapter-mixin-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/mixins/hmac-adapter-mixin-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/hmac-adapter-mixin-test.js should pass jshint.');
  });
});
define('ch-ember-app/tests/unit/mixins/hmac-test', ['exports', 'ember', 'ch-ember-app/mixins/hmac', 'qunit'], function (exports, _ember, _chEmberAppMixinsHmac, _qunit) {

  (0, _qunit.module)('Unit | Mixin | hmac');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var HmacObject = _ember['default'].Object.extend(_chEmberAppMixinsHmac['default']);
    var subject = HmacObject.create();
    assert.ok(subject);
  });
});
define('ch-ember-app/tests/unit/mixins/hmac-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/mixins/hmac-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/hmac-test.js should pass jshint.');
  });
});
define('ch-ember-app/tests/unit/mixins/test-test', ['exports', 'ember', 'ch-ember-app/mixins/test', 'qunit'], function (exports, _ember, _chEmberAppMixinsTest, _qunit) {

  (0, _qunit.module)('Unit | Mixin | test');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var TestObject = _ember['default'].Object.extend(_chEmberAppMixinsTest['default']);
    var subject = TestObject.create();
    assert.ok(subject);
  });
});
define('ch-ember-app/tests/unit/mixins/test-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/mixins/test-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/test-test.js should pass jshint.');
  });
});
define('ch-ember-app/tests/unit/models/client-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('client', 'Unit | Model | client', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ch-ember-app/tests/unit/models/client-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/models/client-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/client-test.js should pass jshint.');
  });
});
define('ch-ember-app/tests/unit/models/entity-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('entity', 'Unit | Model | entity', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ch-ember-app/tests/unit/models/entity-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/models/entity-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/entity-test.js should pass jshint.');
  });
});
define('ch-ember-app/tests/unit/models/search-result-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('search-result', 'Unit | Model | search result', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ch-ember-app/tests/unit/models/search-result-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/models/search-result-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/search-result-test.js should pass jshint.');
  });
});
define('ch-ember-app/tests/unit/models/tag-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('tag', 'Unit | Model | tag', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ch-ember-app/tests/unit/models/tag-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/models/tag-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/tag-test.js should pass jshint.');
  });
});
define('ch-ember-app/tests/unit/routes/client-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:client', 'Unit | Route | client', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ch-ember-app/tests/unit/routes/client-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/client-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/client-test.js should pass jshint.');
  });
});
define('ch-ember-app/tests/unit/serializers/client-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('client', 'Unit | Serializer | client', {
    // Specify the other units that are required for this test.
    needs: ['serializer:client']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it serializes records', function (assert) {
    var record = this.subject();

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
define('ch-ember-app/tests/unit/serializers/client-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/serializers/client-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/serializers/client-test.js should pass jshint.');
  });
});
define('ch-ember-app/tests/unit/serializers/entity-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('entity', 'Unit | Serializer | entity', {
    // Specify the other units that are required for this test.
    needs: ['serializer:entity']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it serializes records', function (assert) {
    var record = this.subject();

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
define('ch-ember-app/tests/unit/serializers/entity-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/serializers/entity-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/serializers/entity-test.js should pass jshint.');
  });
});
define('ch-ember-app/tests/unit/serializers/tag-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('tag', 'Unit | Serializer | tag', {
    // Specify the other units that are required for this test.
    needs: ['serializer:tag']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it serializes records', function (assert) {
    var record = this.subject();

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
define('ch-ember-app/tests/unit/serializers/tag-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/serializers/tag-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/serializers/tag-test.js should pass jshint.');
  });
});
/* jshint ignore:start */

require('ch-ember-app/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;

/* jshint ignore:end */
//# sourceMappingURL=tests.map