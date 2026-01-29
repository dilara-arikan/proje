using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace RobotChatUI.Services.Chat
{
    /// <summary>
    /// Chat Service
    /// Operatör, sistem, QR uyarıları arasında sohbet yönetimi
    /// Robot durumu, görevler ve hatalar UI'de gösterilir
    /// </summary>
    public class ChatService
    {
        private readonly ILogger<ChatService> _logger;
        private readonly List<ChatMessage> _messages = new();
        private readonly int _maxMessages = 1000;

        public event EventHandler<ChatMessage>? MessageReceived;
        public event EventHandler<IReadOnlyList<ChatMessage>>? HistoryUpdated;

        public ChatService(ILogger<ChatService> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Yeni mesaj ekle ve event tetikle
        /// </summary>
        public void AddMessage(string sender, string content, string messageType = "INFO", Dictionary<string, object>? metadata = null)
        {
            var message = new ChatMessage
            {
                Sender = sender,
                Content = content,
                MessageType = messageType,
                Timestamp = DateTime.UtcNow,
                Metadata = metadata ?? new()
            };

            _messages.Add(message);

            // Maksimum mesaj sayısını sınırla
            if (_messages.Count > _maxMessages)
            {
                _messages.RemoveAt(0);
            }

            _logger.LogInformation($"[CHAT] {sender}: {content}");
            MessageReceived?.Invoke(this, message);
        }

        /// <summary>
        /// QR tespiti mesajı
        /// </summary>
        public void LogQrDetection(string qrCode, string location)
        {
            AddMessage(
                "QR_ALERT",
                $"QR Code detected: {qrCode} at {location}",
                "QR_DETECTION",
                new() { { "qr_code", qrCode }, { "location", location } }
            );
        }

        /// <summary>
        /// Görev durumu mesajı
        /// </summary>
        public void LogMissionStatus(string missionId, string status, string message)
        {
            string messageType = status switch
            {
                "COMPLETED" => "SUCCESS",
                "FAILED" => "ERROR",
                "EXECUTING" => "INFO",
                _ => "WARNING"
            };

            AddMessage(
                "ROBOT",
                $"Mission {missionId}: {message}",
                messageType,
                new() { { "mission_id", missionId }, { "status", status } }
            );
        }

        /// <summary>
        /// Sistem mesajı (hata, uyarı)
        /// </summary>
        public void LogSystemMessage(string message, string level = "INFO")
        {
            AddMessage("SYSTEM", message, level);
        }

        /// <summary>
        /// Kullanıcı komutu
        /// </summary>
        public void LogUserCommand(string command, string details = "")
        {
            var msg = string.IsNullOrEmpty(details) ? command : $"{command}: {details}";
            AddMessage("USER", msg, "INFO");
        }

        /// <summary>
        /// Sohbet geçmişi döndür
        /// </summary>
        public IReadOnlyList<ChatMessage> GetHistory(int limit = 100)
        {
            var result = _messages.TakeLast(limit).ToList();
            return result.AsReadOnly();
        }

        /// <summary>
        /// Belirli tipe göre mesajları filtrele
        /// </summary>
        public IReadOnlyList<ChatMessage> GetMessagesByType(string messageType)
        {
            var result = _messages.Where(m => m.MessageType == messageType).ToList();
            return result.AsReadOnly();
        }

        /// <summary>
        /// Tümünü temizle
        /// </summary>
        public void ClearHistory()
        {
            _messages.Clear();
            _logger.LogInformation("[CHAT] History cleared");
        }
    }
}
