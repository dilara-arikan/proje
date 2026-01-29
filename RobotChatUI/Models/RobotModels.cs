using System;
using System.Collections.Generic;

namespace RobotChatUI.Models
{
    /// <summary>
    /// ROS2 QR Detection Message Model
    /// Telemetri: QR taraması sonuçları
    /// </summary>
    public class QrDetection
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string QrCode { get; set; } = string.Empty;
        public DateTime DetectedAt { get; set; } = DateTime.UtcNow;
        public double Confidence { get; set; } = 0.0;
        public string Location { get; set; } = string.Empty; // Pickup/Drop Position
    }

    /// <summary>
    /// Robot Telemetry
    /// Konum, batarya, durum vs.
    /// </summary>
    public class RobotTelemetry
    {
        public string RobotId { get; set; } = "robot-01";
        public double X { get; set; }
        public double Y { get; set; }
        public double Theta { get; set; } // Yaw
        public double BatteryPercentage { get; set; }
        public bool IsCharging { get; set; }
        public string Status { get; set; } = "IDLE"; // IDLE, MAPPING, NAVIGATING, LOADING, UNLOADING
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }

    /// <summary>
    /// Mission / Task
    /// QR ile yapılacak görev (kargo alma/bırakma)
    /// </summary>
    public class MissionTask
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Type { get; set; } = "PICKUP"; // PICKUP, DROP
        public string QrId { get; set; } = string.Empty;
        public string SourceLocation { get; set; } = string.Empty;
        public string DestinationLocation { get; set; } = string.Empty;
        public string Status { get; set; } = "PENDING"; // PENDING, EXECUTING, COMPLETED, FAILED
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
    }

    /// <summary>
    /// Chat Message
    /// UI ile robot/operatör arasında iletişim
    /// </summary>
    public class ChatMessage
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Sender { get; set; } = string.Empty; // "SYSTEM", "USER", "ROBOT", "QR_ALERT"
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string MessageType { get; set; } = "INFO"; // INFO, WARNING, ERROR, SUCCESS, QR_DETECTION
        public Dictionary<string, object> Metadata { get; set; } = new();
    }

    /// <summary>
    /// Robot Connection Configuration
    /// ROS2 / DDS bağlantı ayarları
    /// </summary>
    public class RobotConnectionConfig
    {
        public string RosDomainId { get; set; } = "0";
        public string RmwImplementation { get; set; } = "rmw_cyclonedds_cpp"; // DDS middleware
        public string RosNamespace { get; set; } = "/robot";
        public int TimeoutMs { get; set; } = 5000;
        public bool EnableSecurity { get; set; } = true;
        public string SecurityKeyPath { get; set; } = string.Empty;
    }

    /// <summary>
    /// SLAM / Map Data
    /// Haritalama verileri
    /// </summary>
    public class MapData
    {
        public string MapName { get; set; } = "default_map";
        public byte[] MapImage { get; set; } = Array.Empty<byte>();
        public double Resolution { get; set; } = 0.05; // meters/pixel
        public double X { get; set; }
        public double Y { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
