//
//  URLSessionRequestMaker.swift
//  Fitia
//
//  Created by Kohji Onaja on 23/04/25.
//  Copyright © 2025 Ulises Olave mendoza. All rights reserved.
//
import Foundation

class URLSessionRequestMaker {
    
    func url(endpoint: EndPoint, baseURL: String) async throws -> URLRequest? {
        print("FETCHING: ", baseURL + "/" +  "\(endpoint.function)")
        guard var urlComponents = URLComponents(string: baseURL + "/" +  "\(endpoint.function)") else {
            throw HTTPClientError.badURL
        }
        
        if let queryParameters = endpoint.queryParameters, !queryParameters.isEmpty {
            urlComponents.queryItems = queryParameters.map { param in
                URLQueryItem(name: param.name, value: param.value)
            }
        }
        
        guard let finalURL = urlComponents.url else {
            throw HTTPClientError.badURL
        }
        
        var request = URLRequest(url: finalURL)
        request.httpMethod = endpoint.method.methodName
        
        try await setupHeaders(request: &request, endpoint: endpoint)
        try setupBody(request: &request, endpoint: endpoint)
        return request
    }
    
    private func setupHeaders(request: inout URLRequest, endpoint: EndPoint) async throws{
        switch endpoint.method {
        case .post(let bodyType):
            switch bodyType {
            case .json:
                request.addValue("application/json; charset=UTF-8", forHTTPHeaderField: "Content-Type")
            }
        default:
            break
        }
    }
    private func setupBody(request: inout URLRequest, endpoint: EndPoint) throws {
        switch endpoint.method {
        case .post(let bodyType):
            switch bodyType {
            case .json(let requestBody):
                let encoder = JSONEncoder()
                encoder.dateEncodingStrategy = .iso8601
                let bodyData = try encoder.encode(requestBody)
                // Pretty print
                let jsonObject = try JSONSerialization.jsonObject(with: bodyData, options: [])
                let prettyData = try JSONSerialization.data(
                    withJSONObject: jsonObject,
                    options: [.prettyPrinted]
                )
                request.httpBody = bodyData
            }
        default:
            break
        }
    }
}
