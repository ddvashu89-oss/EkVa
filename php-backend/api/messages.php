<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM messages ORDER BY created_at DESC");
        $messages = $stmt->fetchAll();
        echo json_encode([
            "status" => "success",
            "data" => $messages
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || empty($input['name']) || empty($input['email']) || empty($input['message'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing required contact fields (name, email, message)."]);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO messages (name, email, message) VALUES (:name, :email, :message)");
        $stmt->execute([
            ':name' => $input['name'],
            ':email' => $input['email'],
            ':message' => $input['message']
        ]);
        
        echo json_encode([
            "status" => "success",
            "message" => "Message sent successfully!"
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} elseif ($method === 'DELETE') {
    if (empty($_GET['id'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing message ID for deletion."]);
        exit;
    }
    
    $id = (int)$_GET['id'];
    
    try {
        $stmt = $pdo->prepare("DELETE FROM messages WHERE id = :id");
        $stmt->execute([':id' => $id]);
        
        echo json_encode([
            "status" => "success",
            "message" => "Message deleted successfully."
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
