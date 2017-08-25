<?php

namespace Drupal\acquia_contenthub\Plugin\QueueWorker;

/**
 * Process the import queue for content.
 *
 * @QueueWorker(
 *   id = "acquia_contenthub_import_queue",
 *   title = @Translation("Acquia Content Hub: Import Queue"),
 *   cron = {"time": 60}
 * )
 */
class ContentHubImportQueue extends ContentHubImportQueueBase {}
