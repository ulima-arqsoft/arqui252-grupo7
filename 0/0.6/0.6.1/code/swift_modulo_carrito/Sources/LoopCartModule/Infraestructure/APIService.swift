//
//  File.swift
//  LoopCartModule
//
//  Created by Kohji Onaja on 4/10/25.
//

import Foundation
import LoopCore

enum APIService: String, Codable, APIServicePathProtocol {
    case something
    
    var path: String {
        return self.rawValue
    }
}
