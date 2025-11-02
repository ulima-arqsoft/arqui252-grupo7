//
//  CloudFunction.swift
//  FitiaWatch
//
//  Created by Kohji Onaja on 23/04/25.
//  Copyright © 2025 Ulises Olave mendoza. All rights reserved.
//

import Foundation

let BASE_URL = "http://192.168.1.49:8002/api"  // BFF Mobile en puerto 8002

enum CloudFunction: String, Codable {
    case products
}
