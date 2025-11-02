//
//  URLSessionErrorResolver.swift
//  Fitia
//
//  Created by Kohji Onaja on 23/04/25.
//  Copyright © 2025 Ulises Olave mendoza. All rights reserved.
//


import Foundation

class URLSessionErrorResolver {
    func resolve(statusCode: Int) -> HTTPClientError {
        print("STATUS ERROR CODE FROM SERVICE: \(statusCode)")
        switch statusCode {
        case 400..<500:
            return .clientError
        case 500..<600:
            return .serverError
        default:
            return .generic
        }
    }

    func resolve(error: Error) -> HTTPClientError {
        return .generic
    }
}
