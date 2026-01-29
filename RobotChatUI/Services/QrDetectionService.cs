using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using OpenCvSharp;

namespace RobotChatUI.Services
{
    /// <summary>
    /// QR Kod Algılama Servisi
    /// OpenCvSharp kullanarak QR kodları tespit eder
    /// </summary>
    public class QrDetectionService
    {
        private readonly ILogger<QrDetectionService> _logger;
        private QRCodeDetector? _qrDetector;

        public event EventHandler<QrDetection>? QrDetected;

        public QrDetectionService(ILogger<QrDetectionService> logger)
        {
            _logger = logger;
            InitializeDetector();
        }

        private void InitializeDetector()
        {
            try
            {
                _qrDetector = new QRCodeDetector();
                _logger.LogInformation("[QR] QRCodeDetector initialized");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[QR] Failed to initialize QRCodeDetector");
            }
        }

        /// <summary>
        /// Resimde QR kodları tespit et
        /// </summary>
        public async Task<List<QrDetection>> DetectQrCodesAsync(byte[] imageData)
        {
            var detections = new List<QrDetection>();

            try
            {
                if (_qrDetector == null) return detections;

                await Task.Run(() =>
                {
                    using var mat = Cv2.ImDecode(imageData, ImreadModes.Color);
                    if (mat.Empty())
                    {
                        _logger.LogWarning("[QR] Image decode failed");
                        return;
                    }

                    // QR Kod tespiti
                    var info = _qrDetector.Detect(mat, out var points);
                    if (info.Length > 0)
                    {
                        for (int i = 0; i < info.Length; i++)
                        {
                            var qrCode = info[i];
                            if (!string.IsNullOrEmpty(qrCode))
                            {
                                var detection = new QrDetection
                                {
                                    QrCode = qrCode,
                                    Confidence = 0.95, // OpenCV QR confidence
                                    Location = ExtractLocationFromQrCode(qrCode)
                                };
                                detections.Add(detection);
                                _logger.LogInformation($"[QR] Detected: {qrCode}");
                                QrDetected?.Invoke(this, detection);
                            }
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[QR] Detection error");
            }

            return detections;
        }

        /// <summary>
        /// QR kodundan lokasyon bilgisini çıkar
        /// Format: "A1", "A2", "B1", "B2", etc.
        /// </summary>
        private string ExtractLocationFromQrCode(string qrCode)
        {
            // Example: QR format "LOCATION:A1" or "A1"
            if (qrCode.Contains(":"))
            {
                var parts = qrCode.Split(':');
                return parts.Length > 1 ? parts[1] : qrCode;
            }
            return qrCode;
        }

        /// <summary>
        /// Webcam'dan gerçek zamanlı deteksiyon (background task)
        /// </summary>
        public async Task StartLiveDetectionAsync(int cameraIndex = 0)
        {
            try
            {
                using var capture = new VideoCapture(cameraIndex);
                if (!capture.IsOpened())
                {
                    _logger.LogError("[QR] Cannot open camera");
                    return;
                }

                _logger.LogInformation("[QR] Live detection started");

                while (true)
                {
                    using var frame = new Mat();
                    capture.Read(frame);

                    if (frame.Empty()) break;

                    var qrDetections = await DetectQrCodesAsync(frame.ImEncode(".jpg"));
                    await Task.Delay(100); // 10 FPS
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[QR] Live detection error");
            }
        }
    }
}
