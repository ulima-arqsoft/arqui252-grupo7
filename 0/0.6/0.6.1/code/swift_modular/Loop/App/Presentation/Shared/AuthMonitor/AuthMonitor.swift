//
//  AuthMonitor.swift
//  Loop
//
//  Created by Kohji Onaja on 25/08/25.
//

import SwiftUI
import FirebaseAuth

@MainActor
class AuthMonitor: ObservableObject {
    
    static let shared = AuthMonitor()
    private init(){}
    
    @Published var authState: AuthState = .loggedIn
    
    func doSetStatus(to newState: AuthState) {
        authState = newState
    }
    
    func checkUserAuthState() {
        guard let user = Auth.auth().currentUser else {
            authState = .loggedOut
            return
        }
        authState = .loggedIn
    }
}
