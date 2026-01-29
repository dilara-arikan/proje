using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RobotChatUI.Services.RobotConnectors
{
    /// <summary>
    /// Robot bağlantı arayüzü — tüm bağlantı türlerinin temel sözleşmesi
    /// Implementations: ROS2Connector, TCPConnector, HTTPConnector, SerialConnector, MQTTConnector
    /// </summary>
    public interface IRobotConnector : IDisposable
    {
        string ConnectorType { get; }
        bool IsConnected { get; }

        // Bağlantı yönetimi
        Task ConnectAsync();
        Task DisconnectAsync();

        // Telemetri aboneliği
        event EventHandler<RobotTelemetryEventArgs> TelemetryReceived;
        event EventHandler<QrDetectionEventArgs> QrDetectionReceived;
        event EventHandler<MissionStatusEventArgs> MissionStatusChanged;
        event EventHandler<ErrorEventArgs> ErrorOccurred;

        // Komut gönderme
        Task<bool> SendMissionAsync(MissionTask task);
        Task<bool> EmergencyStopAsync();
        Task<bool> RequestMapAsync();
    }

    /// <summary>
    /// Telemetri Event Arguments
    /// </summary>
    public class RobotTelemetryEventArgs : EventArgs
    {
        public RobotTelemetry Telemetry { get; set; } = new();
    }

    /// <summary>
    /// QR Detection Event Arguments
    /// </summary>
    public class QrDetectionEventArgs : EventArgs
    {
        public QrDetection Detection { get; set; } = new();
    }

    /// <summary>
    /// Mission Status Event Arguments
    /// </summary>
    public class MissionStatusEventArgs : EventArgs
    {
        public MissionTask Task { get; set; } = new();
        public string StatusMessage { get; set; } = string.Empty;
    }

    /// <summary>
    /// Error Event Arguments
    /// </summary>
    public class ErrorEventArgs : EventArgs
    {
        public string ErrorMessage { get; set; } = string.Empty;
        public Exception? InnerException { get; set; }
    }
}
