import React from 'react'

// Component'in alacağı props'lar için bir interface tanımlıyoruz.
interface TranscriptionWarningProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const TranscriptionWarning: React.FC<TranscriptionWarningProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  // Eğer pencere açık değilse, hiçbir şey render etme (null döndür).
  if (!isOpen) {
    return null
  }

  return (
    // Ekranı kaplayan yarı şeffaf bir arka plan.
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      {/* Uyarı kutusu */}
      <div className="bg-white dark:bg-gray-800 p-7 rounded-lg shadow-xl w-full max-w-lg mx-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Transcription & Data Storage Notice
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          This call is being transcribed for training and monitoring purposes and
          your data is stored securely on our customer relationship management
          system in accordance to the data protection act 2018.
        </p>
        {/* Butonların olduğu alan */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded text-sm font-medium bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Confirm & Start
          </button>
        </div>
      </div>
    </div>
  )
}

export default TranscriptionWarning