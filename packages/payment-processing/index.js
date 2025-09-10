const { createRequire } = require('module')
const { join } = require('path')

const require2 = createRequire(import.meta.url || __filename)

const { platform, arch } = process

let nativeBinding = null
let localFileExisted = false
let loadError = null

function isMusl() {
  // For Node 10
  if (!process.report || typeof process.report.getReport !== 'function') {
    try {
      const lddPath = require2('child_process').execSync('which ldd').toString().trim()
      return require2('fs').readFileSync(lddPath, 'utf8').includes('musl')
    } catch (e) {
      return true
    }
  } else {
    const { glibcVersionRuntime } = process.report.getReport().header
    return !glibcVersionRuntime
  }
}

switch (platform) {
  case 'android':
    switch (arch) {
      case 'arm64':
        localFileExisted = require2('fs').existsSync(
          join(__dirname, 'payment-processing.android-arm64.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require2('./payment-processing.android-arm64.node')
          } else {
            nativeBinding = require2('@titan-grove/payment-processing-android-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm':
        localFileExisted = require2('fs').existsSync(
          join(__dirname, 'payment-processing.android-arm-eabi.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require2('./payment-processing.android-arm-eabi.node')
          } else {
            nativeBinding = require2('@titan-grove/payment-processing-android-arm-eabi')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Android ${arch}`)
    }
    break
  case 'win32':
    switch (arch) {
      case 'x64':
        localFileExisted = require2('fs').existsSync(
          join(__dirname, 'payment-processing.win32-x64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require2('./payment-processing.win32-x64-msvc.node')
          } else {
            nativeBinding = require2('@titan-grove/payment-processing-win32-x64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'ia32':
        localFileExisted = require2('fs').existsSync(
          join(__dirname, 'payment-processing.win32-ia32-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require2('./payment-processing.win32-ia32-msvc.node')
          } else {
            nativeBinding = require2('@titan-grove/payment-processing-win32-ia32-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = require2('fs').existsSync(
          join(__dirname, 'payment-processing.win32-arm64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require2('./payment-processing.win32-arm64-msvc.node')
          } else {
            nativeBinding = require2('@titan-grove/payment-processing-win32-arm64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Windows: ${arch}`)
    }
    break
  case 'darwin':
    localFileExisted = require2('fs').existsSync(join(__dirname, 'payment-processing.darwin-universal.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require2('./payment-processing.darwin-universal.node')
      } else {
        nativeBinding = require2('@titan-grove/payment-processing-darwin-universal')
      }
      break
    } catch {}
    switch (arch) {
      case 'x64':
        localFileExisted = require2('fs').existsSync(join(__dirname, 'payment-processing.darwin-x64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require2('./payment-processing.darwin-x64.node')
          } else {
            nativeBinding = require2('@titan-grove/payment-processing-darwin-x64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = require2('fs').existsSync(
          join(__dirname, 'payment-processing.darwin-arm64.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require2('./payment-processing.darwin-arm64.node')
          } else {
            nativeBinding = require2('@titan-grove/payment-processing-darwin-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on macOS: ${arch}`)
    }
    break
  case 'freebsd':
    if (arch !== 'x64') {
      throw new Error(`Unsupported architecture on FreeBSD: ${arch}`)
    }
    localFileExisted = require2('fs').existsSync(join(__dirname, 'payment-processing.freebsd-x64.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require2('./payment-processing.freebsd-x64.node')
      } else {
        nativeBinding = require2('@titan-grove/payment-processing-freebsd-x64')
      }
    } catch (e) {
      loadError = e
    }
    break
  case 'linux':
    switch (arch) {
      case 'x64':
        if (isMusl()) {
          localFileExisted = require2('fs').existsSync(
            join(__dirname, 'payment-processing.linux-x64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require2('./payment-processing.linux-x64-musl.node')
            } else {
              nativeBinding = require2('@titan-grove/payment-processing-linux-x64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = require2('fs').existsSync(
            join(__dirname, 'payment-processing.linux-x64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require2('./payment-processing.linux-x64-gnu.node')
            } else {
              nativeBinding = require2('@titan-grove/payment-processing-linux-x64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm64':
        if (isMusl()) {
          localFileExisted = require2('fs').existsSync(
            join(__dirname, 'payment-processing.linux-arm64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require2('./payment-processing.linux-arm64-musl.node')
            } else {
              nativeBinding = require2('@titan-grove/payment-processing-linux-arm64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = require2('fs').existsSync(
            join(__dirname, 'payment-processing.linux-arm64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require2('./payment-processing.linux-arm64-gnu.node')
            } else {
              nativeBinding = require2('@titan-grove/payment-processing-linux-arm64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm':
        localFileExisted = require2('fs').existsSync(
          join(__dirname, 'payment-processing.linux-arm-gnueabihf.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require2('./payment-processing.linux-arm-gnueabihf.node')
          } else {
            nativeBinding = require2('@titan-grove/payment-processing-linux-arm-gnueabihf')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Linux: ${arch}`)
    }
    break
  default:
    throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`)
}

if (!nativeBinding) {
  if (loadError) {
    throw loadError
  }
  throw new Error(`Failed to load native binding`)
}

module.exports = nativeBinding