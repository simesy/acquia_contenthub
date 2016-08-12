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
define('ch-ember-app/tests/models/entity.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | models/entity.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/entity.js should pass jshint.');
  });
});
define('ch-ember-app/tests/models/list.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | models/list.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/list.js should pass jshint.');
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
define('ch-ember-app/tests/routes/data.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/data.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/data.js should pass jshint.');
  });
});
define('ch-ember-app/tests/routes/entity.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/entity.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/entity.js should pass jshint.\nroutes/entity.js: line 14, col 45, \'reject\' is defined but never used.\n\n1 error');
  });
});
define('ch-ember-app/tests/routes/list.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/list.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/list.js should pass jshint.');
  });
});
define('ch-ember-app/tests/serializers/application.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | serializers/application.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/application.js should pass jshint.');
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
define('ch-ember-app/tests/unit/routes/entity-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:entity', 'Unit | Route | entity', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ch-ember-app/tests/unit/routes/entity-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/entity-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/entity-test.js should pass jshint.');
  });
});
/* jshint ignore:start */

require('ch-ember-app/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;

/* jshint ignore:end */
//# sourceMappingURL=tests.map