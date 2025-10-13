//
//  AuthContainer.swift
//  Loop
//
//  Created by Kohji Onaja on 25/08/25.
//

import Foundation

class AuthContainer {
    
    func buildLoginUseCase() -> LoginUseCase {
        return LoginUseCaseImplementation()
    }
    
    func buildSignInWithGoogleUseCase() -> SignInWithGoogleUseCase {
        return SignInWithGoogleUseCase()
    }
}
