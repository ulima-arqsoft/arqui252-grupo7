//
//  HTTPClientError.swift
//  Fitia
//
//  Created by Kohji Onaja on 23/04/25.
//  Copyright © 2025 Ulises Olave mendoza. All rights reserved.
//
import Foundation

enum HTTPClientError: LocalizedError {
    case clientError
    case serverError
    case generic
    case parsingError
    case badURL
    case badRequest
    case responseError
    case firebasedResponseStatusNotOk

    public var errorDescription: String? {
        switch self {
        case .clientError:
            return "Client error: la solicitud falló por un problema del cliente."
        case .serverError:
            return "Server error: el servidor devolvió un error."
        case .generic:
            return "Error genérico: ocurrió un error desconocido."
        case .parsingError:
            return "Parsing error: no se pudo decodificar la respuesta."
        case .badURL:
            return "Bad URL: la URL proporcionada está mal formada."
        case .badRequest:
            return "Bad request: el servidor no pudo entender la solicitud."
        case .responseError:
            return "Response error: la respuesta del servidor no es válida."
        case .firebasedResponseStatusNotOk:
            return "Response status not OK"
        }
    }
}
