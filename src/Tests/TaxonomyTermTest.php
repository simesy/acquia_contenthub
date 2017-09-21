<?php

namespace Drupal\acquia_contenthub\Tests;

use Drupal\taxonomy\Tests\TaxonomyTestTrait;

/**
 * Test that Acquia Content Hub respects Taxonomy Term.
 *
 * @group acquia_contenthub
 */
class TaxonomyTermTest extends WebTestBase {

  use TaxonomyTestTrait;

  /**
   * Vocabulary for testing.
   *
   * @var \Drupal\taxonomy\VocabularyInterface
   */
  protected $vocabulary;

  /**
   * Taxonomy term reference field for testing.
   *
   * @var \Drupal\field\FieldConfigInterface
   */
  protected $field;

  /**
   * The permissions of the admin user.
   *
   * @var string[]
   */
  protected $adminUserPermissions = [
    'administer acquia content hub',
    'access administration pages',
    'administer taxonomy',
  ];

  /**
   * Modules to enable for this test.
   *
   * @var array
   */
  public static $modules = [
    'acquia_contenthub',
    'user',
    'taxonomy',
  ];

  /**
   * {@inheritdoc}
   */
  public function setUp() {
    parent::setUp();

    // Login user and create vocabulary.
    $this->drupalLogin($this->adminUser);
    $this->vocabulary = $this->createVocabulary();

    // Enable Publish options for new vocabulary.
    $this->configureContentHubContentTypes('taxonomy_term', [$this->vocabulary->get('vid')]);
  }

  /**
   * Test terms in a single and multiple hierarchy.
   */
  public function testTaxonomyTermHierarchy() {
    // Create two taxonomy terms.
    $term1 = $this->createTerm($this->vocabulary);
    $term2 = $this->createTerm($this->vocabulary);

    // Edit $term2, setting $term1 as parent.
    $edit = [];
    $edit['parent[]'] = [$term1->id()];
    $this->drupalPostForm('taxonomy/term/' . $term2->id() . '/edit', $edit, t('Save'));

    // Check CH cdf response.
    $output = $this->drupalGetJSON('acquia-contenthub-cdf/taxonomy/term/' . $term2->id(), [
      'query' => [
        '_format' => 'acquia_contenthub_cdf',
      ],
    ]);
    $this->assertResponse(200);

    // Check cdf format.
    $this->assertTrue(isset($output['entities']['0']['attributes']['parent']), 'Parent field is present.');
    $this->assertTrue(is_array($output['entities']['0']['attributes']['parent']), 'Parent field is array.');

    // Collect data about parent entity.
    $type = $output['entities']['0']['attributes']['parent']['type'];
    $value = $output['entities']['0']['attributes']['parent']['value'];

    // Check parent field format mapping.
    $this->assertEqual($type, 'array<reference>', 'Field type looks correct.');

    // Extract first uuid from parent field.
    $parent_uuid = '';
    if ($value) {
      $parent_lang = array_pop($value);
      $parent_uuid = array_pop($parent_lang);
    }

    // Compare first uuid from response with term1 uuid.
    $this->assertEqual($term1->uuid(), $parent_uuid, 'Parent term looks correct.');
  }

}
