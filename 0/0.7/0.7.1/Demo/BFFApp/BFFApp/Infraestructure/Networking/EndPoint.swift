//
//  EndPoint.swift
//  Fitia
//
//  Created by Kohji Onaja on 23/04/25.
//  Copyright © 2025 Ulises Olave mendoza. All rights reserved.
//

import Foundation

struct EndPoint{
    let queryParameters: [URLQueryItem]?
    let headers: [String: String]?
    let method: HTTPMethod
    let function: CloudFunction
    
    init(
        queryParameters: [URLQueryItem]? = nil,
        headers: [String: String]? = nil,
        method: HTTPMethod,
        function: CloudFunction
    ) {
        self.queryParameters = queryParameters
        self.headers = headers
        self.method = method
        self.function = function
    }
    
}
