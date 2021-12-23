<?php

namespace App\Console\Commands;

use App\Events\PublicEvent;
use Illuminate\Console\Command;

class PublicEventCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:public-event';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $params = [
            'x' => 'x argument',
            'y' => 'y argument'
        ];
        broadcast(new \App\Events\PublicEvent($params));
    }
}
