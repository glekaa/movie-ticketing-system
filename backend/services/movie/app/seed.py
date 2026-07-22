import asyncio
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal
from sqlalchemy import delete

from app.database import AsyncSessionLocal
from app.models import (
    Genre,
    Movie,
    MovieStatus,
    Screen,
    Seat,
    SeatType,
    Showtime,
    ShowtimeStatus,
    Theater,
    movie_genres,
)

async def seed():
    async with AsyncSessionLocal() as db:
        print("Cleaning up existing movie database tables...")
        # Delete showtimes first (child of screen/movie)
        await db.execute(delete(Showtime))
        # Delete seats (child of screen)
        await db.execute(delete(Seat))
        # Delete screens (child of theater)
        await db.execute(delete(Screen))
        # Delete theaters
        await db.execute(delete(Theater))
        # Delete movie genres associations
        await db.execute(movie_genres.delete())
        # Delete movies
        await db.execute(delete(Movie))
        # Delete genres
        await db.execute(delete(Genre))
        await db.commit()

        print("Seeding genres...")
        action = Genre(name="Action", slug="action")
        comedy = Genre(name="Comedy", slug="comedy")
        drama = Genre(name="Drama", slug="drama")
        scifi = Genre(name="Sci-Fi", slug="sci-fi")
        horror = Genre(name="Horror", slug="horror")
        romance = Genre(name="Romance", slug="romance")
        thriller = Genre(name="Thriller", slug="thriller")
        
        db.add_all([action, comedy, drama, scifi, horror, romance, thriller])

        print("Seeding movies...")
        inception = Movie(
            title="Inception",
            description="A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project.",
            duration_minutes=148,
            release_date=date(2010, 7, 16),
            status=MovieStatus.now_showing,
            age_rating=13,
            genres=[action, scifi, thriller],
            poster_url="https://image.tmdb.org/t/p/w500/o0ptmQJCr7urIQRjSRmfg4st2hn.jpg",
            backdrop_url="https://image.tmdb.org/t/p/original/8ZzRie42wCU75646554t8tT5l8X.jpg"
        )
        
        dark_knight = Movie(
            title="The Dark Knight",
            description="When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            duration_minutes=152,
            release_date=date(2008, 7, 18),
            status=MovieStatus.now_showing,
            age_rating=13,
            genres=[action, thriller, drama],
            poster_url="https://image.tmdb.org/t/p/w500/qJ2tWw3YiO1n6I9mECiRUiStatic.jpg",
            backdrop_url="https://image.tmdb.org/t/p/original/dqK66n13bt4wRUr7jKs1v878DL.jpg"
        )
        
        interstellar = Movie(
            title="Interstellar",
            description="A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
            duration_minutes=169,
            release_date=date(2014, 11, 7),
            status=MovieStatus.now_showing,
            age_rating=10,
            genres=[scifi, drama],
            poster_url="https://image.tmdb.org/t/p/w500/gEU2Qv46tN7vG8VGsfsz42jWabk.jpg",
            backdrop_url="https://image.tmdb.org/t/p/original/xJHokZbljv3Z103tUjRiTqN5i6b.jpg"
        )
        
        dune_two = Movie(
            title="Dune: Part Two",
            description="Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
            duration_minutes=166,
            release_date=date(2024, 3, 1),
            status=MovieStatus.now_showing,
            age_rating=13,
            genres=[action, scifi, drama],
            poster_url="https://image.tmdb.org/t/p/w500/czbbJc9z8HQH9uclsGZ451512qg.jpg",
            backdrop_url="https://image.tmdb.org/t/p/original/xOMo8j320vC6262ndHfsH4br4nl.jpg"
        )
        
        endgame = Movie(
            title="Avengers: Endgame",
            description="After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
            duration_minutes=181,
            release_date=date(2019, 4, 26),
            status=MovieStatus.archived,
            age_rating=13,
            genres=[action, scifi],
            poster_url="https://image.tmdb.org/t/p/w500/or06umi6kg1Urzi6gJ25tJmYqdY.jpg",
            backdrop_url="https://image.tmdb.org/t/p/original/7RyHs7SRy7cvPL3iO2am44RIPIu.jpg"
        )
        
        spiderman_beyond = Movie(
            title="Spider-Man: Beyond the Spider-Verse",
            description="Miles Morales returns for the next chapter of the Oscar-winning Spider-Verse saga, continuing his multiversal adventure with Gwen Stacy and a new team of Spider-People.",
            duration_minutes=140,
            release_date=date(2027, 5, 1),
            status=MovieStatus.coming_soon,
            age_rating=0,
            genres=[action, scifi, comedy],
            poster_url="https://image.tmdb.org/t/p/w500/spider_beyond_mock.jpg",
            backdrop_url="https://image.tmdb.org/t/p/original/spider_beyond_backdrop_mock.jpg"
        )
        
        db.add_all([inception, dark_knight, interstellar, dune_two, endgame, spiderman_beyond])

        print("Seeding theaters and screens...")
        theater1 = Theater(name="Cinema City Downtown", location="123 Main St, Metropolis")
        theater2 = Theater(name="Grand Plaza Theater", location="456 Oak Rd, Gotham")
        
        db.add_all([theater1, theater2])
        
        screen1 = Screen(name="Screen 1 (Standard)", total_rows=5, seats_per_row=8, theater=theater1)
        screen2 = Screen(name="Screen 2 (IMAX)", total_rows=8, seats_per_row=10, theater=theater1)
        screen3 = Screen(name="Dolby Atmos Hall", total_rows=6, seats_per_row=8, theater=theater2)
        
        db.add_all([screen1, screen2, screen3])

        print("Generating seat layouts for all screens...")
        screens = [screen1, screen2, screen3]
        for screen in screens:
            for r in range(screen.total_rows):
                row_label = chr(65 + r) # A, B, C, D...
                for s in range(1, screen.seats_per_row + 1):
                    # Determine seat type
                    if r >= screen.total_rows - 1:
                        seat_type = SeatType.love
                    elif r >= screen.total_rows - 2:
                        seat_type = SeatType.vip
                    else:
                        seat_type = SeatType.standard
                    
                    seat = Seat(
                        screen=screen,
                        row_label=row_label,
                        seat_number=s,
                        seat_type=seat_type
                    )
                    db.add(seat)

        print("Seeding showtimes...")
        # Schedule showtimes for Day 0 (today), Day 1 (tomorrow), and Day 2 (day after)
        for day_offset in range(3):
            def make_dt(hour, minute):
                base_date = datetime.now(timezone.utc).date() + timedelta(days=day_offset)
                return datetime(base_date.year, base_date.month, base_date.day, hour, minute, tzinfo=timezone.utc)

            # Screen 1 (Cinema City Downtown - Standard Screen)
            db.add_all([
                Showtime(
                    screen=screen1,
                    movie=inception,
                    start_time=make_dt(13, 0),
                    end_time=make_dt(13, 0) + timedelta(minutes=inception.duration_minutes),
                    base_price=Decimal("12.50"),
                    status=ShowtimeStatus.scheduled
                ),
                Showtime(
                    screen=screen1,
                    movie=dark_knight,
                    start_time=make_dt(16, 30),
                    end_time=make_dt(16, 30) + timedelta(minutes=dark_knight.duration_minutes),
                    base_price=Decimal("12.50"),
                    status=ShowtimeStatus.scheduled
                ),
                Showtime(
                    screen=screen1,
                    movie=interstellar,
                    start_time=make_dt(20, 0),
                    end_time=make_dt(20, 0) + timedelta(minutes=interstellar.duration_minutes),
                    base_price=Decimal("12.50"),
                    status=ShowtimeStatus.scheduled
                )
            ])

            # Screen 2 (Cinema City Downtown - IMAX Screen)
            db.add_all([
                Showtime(
                    screen=screen2,
                    movie=dune_two,
                    start_time=make_dt(12, 0),
                    end_time=make_dt(12, 0) + timedelta(minutes=dune_two.duration_minutes),
                    base_price=Decimal("18.00"),
                    status=ShowtimeStatus.scheduled
                ),
                Showtime(
                    screen=screen2,
                    movie=inception,
                    start_time=make_dt(15, 30),
                    end_time=make_dt(15, 30) + timedelta(minutes=inception.duration_minutes),
                    base_price=Decimal("16.00"),
                    status=ShowtimeStatus.scheduled
                ),
                Showtime(
                    screen=screen2,
                    movie=dune_two,
                    start_time=make_dt(19, 0),
                    end_time=make_dt(19, 0) + timedelta(minutes=dune_two.duration_minutes),
                    base_price=Decimal("18.00"),
                    status=ShowtimeStatus.scheduled
                ),
                Showtime(
                    screen=screen2,
                    movie=dark_knight,
                    start_time=make_dt(22, 30),
                    end_time=make_dt(22, 30) + timedelta(minutes=dark_knight.duration_minutes),
                    base_price=Decimal("16.00"),
                    status=ShowtimeStatus.scheduled
                )
            ])

            # Screen 3 (Grand Plaza Theater - Dolby Atmos Hall)
            db.add_all([
                Showtime(
                    screen=screen3,
                    movie=interstellar,
                    start_time=make_dt(14, 0),
                    end_time=make_dt(14, 0) + timedelta(minutes=interstellar.duration_minutes),
                    base_price=Decimal("14.00"),
                    status=ShowtimeStatus.scheduled
                ),
                Showtime(
                    screen=screen3,
                    movie=dune_two,
                    start_time=make_dt(18, 0),
                    end_time=make_dt(18, 0) + timedelta(minutes=dune_two.duration_minutes),
                    base_price=Decimal("15.00"),
                    status=ShowtimeStatus.scheduled
                ),
                Showtime(
                    screen=screen3,
                    movie=inception,
                    start_time=make_dt(21, 30),
                    end_time=make_dt(21, 30) + timedelta(minutes=inception.duration_minutes),
                    base_price=Decimal("14.00"),
                    status=ShowtimeStatus.scheduled
                )
            ])

        await db.commit()
        print("Movie database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
