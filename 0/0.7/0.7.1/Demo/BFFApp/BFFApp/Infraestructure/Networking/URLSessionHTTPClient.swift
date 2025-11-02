//
//  URLSessionHTTPClient.swift
//  FitiaWatch
//
//  Created by Kohji Onaja on 23/04/25.
//  Copyright © 2025 Ulises Olave mendoza. All rights reserved.
//

import Foundation

class URLSessionHTTPClient: HTTPClient {
    
    private let session = URLSession.shared
    private let requestMaker = URLSessionRequestMaker()
    private let errorResolver = URLSessionErrorResolver()
    
    init(){}
    
    func fetch<T: Codable>(endpoint: EndPoint) async throws -> T? {
        let data = try await innerFetch(endpoint: endpoint)
        let decoder = JSONDecoder()
        let decodedObject = try decoder.decode(T.self, from: data)
        return decodedObject
    }
    
    func fetch(endpoint: EndPoint) async throws {
        try await innerFetch(endpoint: endpoint)
    }

    
    @discardableResult
    private func innerFetch(endpoint: EndPoint) async throws -> Data {
        guard let request = try await requestMaker.url(endpoint: endpoint, baseURL: BASE_URL) else {
            throw HTTPClientError.badRequest
        }
        
        let (data, response) = try await session.data(for: request)
        
        guard let response = response as? HTTPURLResponse else {
            throw HTTPClientError.responseError
        }
        guard response.statusCode == 200 else {
            print("URLSessionHTTPClient Error", response.statusCode)
            throw errorResolver.resolve(statusCode: response.statusCode)
        }
        
//        if endpoint.function == .generalSearchV3 {
            let jsonObject = try JSONSerialization.jsonObject(with: data, options: [])
            
            let prettyData = try JSONSerialization.data(
                withJSONObject: jsonObject,
                options: [.prettyPrinted]
            )
            
            if let prettyString = String(data: prettyData, encoding: .utf8) {
                print("============ RESULT DATA ==========")
                print(prettyString)
                print("====================================")
            }
//        }
//        
        return data
    }

}
