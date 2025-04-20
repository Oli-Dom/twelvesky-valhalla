import { Sword, Users, ShieldAlert } from "lucide-react"


export function Features(){
    return(
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">
              LEGENDARY FEATURES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-6 shadow-lg border border-primary/20">
                <Sword className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Epic Combat</h3>
                <p className="text-muted-foreground">
                  Master powerful abilities and engage in strategic battles
                  against players and mythical creatures.
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 shadow-lg border border-primary/20">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Massive Multiplayer</h3>
                <p className="text-muted-foreground">
                  Join thousands of players in a persistent world filled with
                  quests, raids, and epic events.
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 shadow-lg border border-primary/20">
                <ShieldAlert className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Legendary Gear</h3>
                <p className="text-muted-foreground">
                  Collect and craft powerful weapons and armor to customize your
                  character's appearance and abilities.
                </p>
              </div>
            </div>
          </div>
        </section>
    )
}