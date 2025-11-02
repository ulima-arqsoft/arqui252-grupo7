//
//  HTTPClient.swift
//  Fitia
//
//  Created by Kohji Onaja on 23/04/25.
//  Copyright © 2025 Ulises Olave mendoza. All rights reserved.
//

import Foundation

protocol HTTPClient{
    func fetch<T: Codable>(endpoint: EndPoint) async throws -> T?
    func fetch(endpoint: EndPoint) async throws
}
