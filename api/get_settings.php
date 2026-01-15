<?php
require 'db.php';

try {
    $stmt = $pdo->query("SELECT setting_key, setting_value FROM site_settings");
    $settings = [];
    while ($row = $stmt->fetch()) {
        $settings[$row['setting_key']] = json_decode($row['setting_value']) ?? $row['setting_value'];
    }
    
    // Analytics Summary
    $stmtView = $pdo->query("SELECT COUNT(*) as count FROM analytics_logs WHERE event_name = 'PageView'");
    $views = $stmtView->fetch()['count'];
    
    $stmtClick = $pdo->query("SELECT COUNT(*) as count FROM analytics_logs WHERE event_name = 'ButtonClick'");
    $clicks = $stmtClick->fetch()['count'];

    $stmtRecent = $pdo->query("SELECT event_name as event, created_at as time FROM analytics_logs ORDER BY id DESC LIMIT 50");
    $events = $stmtRecent->fetchAll();

    echo json_encode([
        "settings" => $settings,
        "analytics" => [
            "views" => $views,
            "clicks" => $clicks,
            "events" => $events
        ]
    ]);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>