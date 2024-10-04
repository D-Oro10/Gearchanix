<?php
session_start();

$host = '127.0.0.1';
$db = 'gearchanix';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    die("Error connecting to database: " . $e->getMessage());
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $pdo->prepare("SELECT * FROM users WHERE user_email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    // Verify
    if ($user && password_verify($password, $user['user_password'])) {
        // Set session variables
        $_SESSION['user_id'] = $user['user_ID'];
        $_SESSION['user_role'] = $user['user_role'];

        // Redirect based on the user role
        switch ($user['user_role']) {
            case 'DISPATCHER':
                header('Location: /Gearchanix/GEARCHANIX-MAIN/gearchanix/public/pages/dispatcher/dispatcher.html');
                break;
            case 'CHIEF-TMPS':
                header('Location: /GEARCHANIX-MAIN/gearchanix/src/pages/chief_dashboard.html');
                break;
            case 'ADMIN CLERK':
                header('Location: /GEARCHANIX-MAIN/gearchanix/src/pages/admin_dashboard.html');
                break;
            case 'MECHANIC':
                header('Location: /GEARCHANIX-MAIN/gearchanix/src/pages/mechanic_dashboard.html');
                break;
            default:
                // Redirect to a generic page if no specific role is found
                echo "<script>alert('No Role Assigned Yet');</script>";
                header('Location: /Gearchanix/GEARCHANIX-MAIN/gearchanix/public/pages/login-reg/login.html');
                break;
        }
        exit;

    } else {
        // If Invalid login credentials 
        echo "<script>alert('Invalid login credentials');</script>";
        header('Location: /Gearchanix/GEARCHANIX-MAIN/gearchanix/public/pages/login-reg/login.html');
        exit;  
    }
}
?>
