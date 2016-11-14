<?php

/**
 * @file
 * Contains \Drupal\acquia_contenthub\Tests\PassingTest.
 */

namespace Drupal\acquia_contenthub\Tests;

/**
 * Provides a passing test. See https://www.drupal.org/node/2645590
 *
 * @group acquia_contenthub
 */
class PassingTest extends WebTestBase {

  /**
   * {@inheritdoc}
   */
  public function setUp() {
    parent::setUp();
  }

  /**
   * Tests various operations via the Acquia Content Hub admin UI.
   */
  public function testPassingTest() {
    $this->assertTrue(TRUE);
  }
