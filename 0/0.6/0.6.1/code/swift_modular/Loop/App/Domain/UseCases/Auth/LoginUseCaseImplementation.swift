//
//  LoginUseCaseImplementation.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import Foundation

class LoginUseCaseImplementation: LoginUseCase {
    func execute() async {
        try? await Task.sleep(nanoseconds: 3_000_000_000)
        await AuthMonitor.shared.doSetStatus(to: .loggedIn)
    }
}
