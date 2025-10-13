//
//  CartEmptyView.swift
//  Loop
//
//  Created by Kohji Onaja on 23/08/25.
//

import SwiftUI

struct CartEmptyView: View {
    
    let backToStoreAction: () -> Void
    
    var body: some View {
         VStack(spacing: 20){
            VStack(spacing: 30){
                Image("ic_shopping_bag")
                    .renderingMode(.template)
                    .resizable()
                    .scaledToFit()
                    .foregroundColor(.gray)
                    .frame(width: 40,height: 40)
                    .padding(25)
                    .overlay {
                        Circle()
                            .stroke(.gray, lineWidth: 3)
                    }
                Text("Tu carrito está vacío")
                    .font(.system(size: 18, weight: .regular))
   
            }
                .padding(.top, 50)
        }
    }
}

#Preview {
    CartViewBuilder.build()
}
