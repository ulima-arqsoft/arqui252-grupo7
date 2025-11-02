//
//  BodyDataType.swift
//  Fitia
//
//  Created by Kohji Onaja on 23/04/25.
//  Copyright © 2025 Ulises Olave mendoza. All rights reserved.
//
import Foundation

enum HTTPMethod{

    case post(bodyType: BodyDataType)
    case get
    case delete
    case put
    
    var methodName: String {
        switch self {
        case .post: return "POST"
        case .get: return "GET"
        case .delete: return "DELETE"
        case .put: return "PUT"
        }
    }
    
    
}
