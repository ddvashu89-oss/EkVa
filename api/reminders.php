<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM reminders ORDER BY created_at DESC");
        $reminders = $stmt->fetchAll();
        echo json_encode([
            "status" => "success",
            "data" => $reminders
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || empty($input['plant_name']) || empty($input['task_type']) || empty($input['frequency']) || empty($input['reminder_time'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing required reminder fields (plant_name, task_type, frequency, reminder_time)."]);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO reminders (plant_name, task_type, frequency, reminder_time, is_enabled) 
                               VALUES (:plant_name, :task_type, :frequency, :reminder_time, 1)");
        $stmt->execute([
            ':plant_name' => $input['plant_name'],
            ':task_type' => $input['task_type'],
            ':frequency' => $input['frequency'],
            ':reminder_time' => $input['reminder_time']
        ]);
        
        echo json_encode([
            "status" => "success",
            "message" => "Reminder scheduled successfully!"
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} elseif ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['id']) || !isset($input['is_enabled'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing required update fields (id, is_enabled)."]);
        exit;
    }
    
    $id = (int)$input['id'];
    $isEnabled = (int)$input['is_enabled'];
    
    try {
        $stmt = $pdo->prepare("UPDATE reminders SET is_enabled = :is_enabled WHERE id = :id");
        $stmt->execute([
            ':is_enabled' => $isEnabled,
            ':id' => $id
        ]);
        
        echo json_encode([
            "status" => "success",
            "message" => "Reminder state toggled successfully."
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} elseif ($method === 'DELETE') {
    if (empty($_GET['id'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing reminder ID for deletion."]);
        exit;
    }
    
    $id = (int)$_GET['id'];
    
    try {
        $stmt = $pdo->prepare("DELETE FROM reminders WHERE id = :id");
        $stmt->execute([':id' => $id]);
        
        echo json_encode([
            "status" => "success",
            "message" => "Reminder deleted successfully."
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
