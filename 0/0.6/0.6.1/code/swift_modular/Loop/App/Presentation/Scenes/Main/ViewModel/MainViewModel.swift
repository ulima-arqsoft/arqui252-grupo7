//
//  MainViewModel.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI

@MainActor
class MainViewModel: ObservableObject {
    let router: Router?
    
    init(router: Router?) {
        self.router = router
    }
}
